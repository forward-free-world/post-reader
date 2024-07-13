import * as fs from 'fs';
import * as path from 'path';
import { LinkRegex, TitleRegex } from '../utilities';

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
      if (link) {
        const scraped = await fetch(link).then(response => response.text());

        if (scraped) {
          markdown = enrichWithScrapedData(markdown, scraped);
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

function enrichWithScrapedData(markdown: string, scraped: string) {
  const [, mdTitle] = TitleRegex.exec(markdown) ?? [null, null],
    scrapedTitleRegex = new RegExp('\\<h1[\\s\\S]{0,}\\>(.+)\\<\\/h1>'),
    [, scrapedTitle] = scrapedTitleRegex.exec(scraped ?? '') ?? [null, null];

  if (mdTitle && scrapedTitle) {
    markdown = markdown.replace(mdTitle, scrapedTitle);
  }
  return markdown;
}

// Function to concatenate MD contents and write to a new file
async function concatenateMdFiles(inputDir: string, outputFile: string): Promise<void> {
  try {
    const mdContents = await readMdFilesFromDirectory(inputDir);

    // Concatenate all MD contents
    const concatenatedMd = mdContents.join('\n%%%break%%%\n');

    // Write concatenated MD to output file
    await fs.promises.writeFile(outputFile, concatenatedMd, 'utf8');

    console.log(`Concatenated MD saved to ${outputFile}`);
  } catch (err) {
    console.error('Error concatenating MD files:', err);
  }
}

// Example usage
const inputDirectory = './src/content'; // Replace with your input directory
const outputFileName = './out/all.md'; // Replace with your output file name

concatenateMdFiles(inputDirectory, outputFileName);
