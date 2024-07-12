import * as fs from 'fs';
import * as path from 'path';

// Function to read all MD files from a directory
async function readMdFilesFromDirectory(
  directoryPath: string
): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const mdFiles = files.filter(
      (file) =>
        path.extname(file).toLowerCase() === '.md' ||
        path.extname(file).toLowerCase() === '.md'
    );
    const mdContents: string[] = [];

    for (const file of mdFiles) {
      const filePath = path.join(directoryPath, file);
      const content = await fs.promises.readFile(filePath, 'utf8');
      mdContents.push(content);
    }

    return mdContents;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
}

// Function to concatenate MD contents and write to a new file
async function concatenateMdFiles(
  inputDir: string,
  outputFile: string
): Promise<void> {
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
