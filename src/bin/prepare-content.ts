import * as fs from 'fs';
import * as path from 'path';
import { ImageRegex, LinkRegex, TitleRegex } from '../utilities';
import { TldrDTO } from './models/tldr-dto';
import { env } from 'process';
const parseSrcset = require('parse-srcset');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
import { PrepareContentConfig } from './prepare-content-config';
require('dotenv').config();

// Function to read all MD files from a directory
async function readMdFilesFromDirectory(directoryPath: string): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(directoryPath),
      mdFiles = files.filter(file => path.extname(file).toLowerCase() === '.md'),
      mdContents: string[] = [];

    for (const file of mdFiles) {
      const filePath = path.join(directoryPath, file);
      let markdown = await fs.promises.readFile(filePath, 'utf8');

      if (!markdown) {
        continue;
      }

      const [, link] = LinkRegex.exec(markdown) ?? [null, null];
      if (link && PrepareContentConfig.blacklistScraping.every(blacklist => !link.includes(blacklist))) {
        const scraped = await fetch(link).then(response => response.text());
        const { document }: { document: HTMLElement } = new JSDOM(scraped).window;

        if (scraped) {
          markdown = enrichWithScrapedData(markdown, document);
          summarise(link);
        }
      }

      mdContents.push(markdown);
    }

    return mdContents;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
}

function summarise(url: string) {
  const summariesFolder = './out/summaries';
  let results: string[] = [];
  try {
    results = fs.readdirSync(summariesFolder);
  } catch (e) {
    if (e.code === 'ENOENT') {
      fs.mkdirSync(summariesFolder);
    }
  }

  const filename = btoa(url) + '.json';
  if (results.includes(filename)) {
    return;
  }

  fetch(env.SUMMARISEAPI as string, {
    body: JSON.stringify({
      url,
      min_length: 100,
      max_length: 300,
      is_detailed: false
    }),
    headers: {
      Accept: 'application/json',
      'x-rapidapi-key': env.SUMMARISEAPIKEY as string
    },
    method: 'POST'
  })
    .then(response => response.json())
    .then(
      ({
        summary,
        article_title,
        article_authors,
        article_image,
        article_pub_date,
        article_url,
        article_abstract
      }: TldrDTO) => {
        console.info(`Caching ${url}`);
        if (summary?.length) {
          fs.writeFile(
            `${summariesFolder}/${filename}`,
            JSON.stringify({
              summary,
              article_title,
              article_authors,
              article_image,
              article_pub_date,
              article_url,
              article_abstract
            }) ?? '',
            e => {
              if (e) {
                console.error(e);
              }
            }
          );
        }
      }
    )
    .catch(e => {
      console.warn(`Could not fetch summary for ${url}, because ${e}`);
    });
}

function enrichWithScrapedData(markdown: string, document: HTMLElement) {
  const [, mdTitle] = TitleRegex.exec(markdown) ?? [null, null],
    [, mdImage] = ImageRegex.exec(markdown) ?? [null, null],
    scrapedTitle = document.querySelector('h1')?.innerHTML ?? '',
    images = getImages(document);

  if (scrapedTitle) {
    if (mdTitle) {
      // Used to overwrite with scraped title. Caused issues with some scrapes
      // markdown = markdown.replace(mdTitle, scrapedTitle);
    } else {
      markdown = addElement(markdown, 'Title', scrapedTitle);
    }
  }

  if (!mdImage && images.length > 0) {
    const { src } = images[0] ?? { src: '' };
    markdown = addElement(markdown, 'Image', src);
  }

  return markdown;
}

function addElement(markdown: string, tag: string, value: string): string {
  return markdown.replace('---\n', `---\n[//]:# (${tag}: ${value})\n`);
}

type HtmlImage = {
  src: string;
  presentation: boolean;
  width: number;
  eagerLoading: boolean;
};

type ScoredHtmlImage = HtmlImage & {
  score: number;
};

function getImages(document: HTMLElement): ScoredHtmlImage[] {
  const images: HtmlImage[] = [];

  document.querySelectorAll('img').forEach(img => {
    let { src } = img;
    const { role, loading, attributes } = img,
      width = (attributes as any)['width'],
      parent = img.closest('picture');

    if (!src && parent) {
      const source = parent.querySelector('source');
      if (source?.srcset) {
        const srcSets: { url: string; w: number }[] = parseSrcset(source.srcset);
        if (srcSets?.length) {
          srcSets.sort(({ w: aw }, { w: bw }) => bw - aw);
          src = srcSets[0]?.url ?? '';
        }
      }
    }

    if (src) {
      images.push({
        src,
        presentation: role === 'presentation',
        eagerLoading: loading === 'eager',
        width: +(width ?? { value: '0' }).value
      });
    }
  });

  const rankedImages = images
    .sort((a, b) => a.width - b.width)
    .map((img, i) => {
      let score = 0;

      if (img.eagerLoading) score += 2;
      if (img.presentation) score += 2;
      score += i;

      return {
        ...img,
        score
      } as ScoredHtmlImage;
    })
    .sort((a, b) => b.score + b.width - (a.score + a.width));

  return rankedImages;
}

// Function to concatenate MD contents and write to a new file
async function concatenateMdFiles(inputDir: string, outputFile: string): Promise<void> {
  try {
    const mdContents = await readMdFilesFromDirectory(inputDir);

    // Concatenate all MD contents
    const concatenatedMd = mdContents.join('\n%%%break%%%\n');

    // Write concatenated MD to output file
    await fs.promises.writeFile(outputFile, concatenatedMd, 'utf8');

    console.info(`Concatenated MD saved to ${outputFile}`);
  } catch (err) {
    console.error('Error concatenating MD files:', err);
  }
}

// Example usage
const inputDirectory = './src/content'; // Replace with your input directory
const outputFileName = './out/all.md'; // Replace with your output file name

concatenateMdFiles(inputDirectory, outputFileName);
