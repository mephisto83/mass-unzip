const fs = require('fs-extra');
const path = require('path');
const unzipper = require('unzipper');

const sourceFolder = 'D:\\font'; // Change this to your source folder
const targetFolder = 'D:\\apainter\\layers\\fonts'; // Change this to your target folder

// Ensure the target folder exists
fs.ensureDirSync(targetFolder);

// Function to check if a file is a font file
function isFontFile(fileName) {
    const fontExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    return fontExtensions.includes(path.extname(fileName).toLowerCase());
}

// Function to unzip a file and move font files to the target folder
async function unzipAndMoveFonts(zipFilePath) {
    const directory = await unzipper.Open.file(zipFilePath);
    for (const file of directory.files) {
        const filePath = path.join(sourceFolder, file.path);
        if (isFontFile(file.path)) {
            const targetPath = path.join(targetFolder, path.basename(file.path));
            file.stream().pipe(fs.createWriteStream(targetPath));
        }
    }
}

// Function to process all zip files in the source folder
async function processZipFiles() {
    const files = await fs.readdir(sourceFolder);
    for (const file of files) {
        const filePath = path.join(sourceFolder, file);
        if (path.extname(file).toLowerCase() === '.zip') {
            await unzipAndMoveFonts(filePath);
        }
    }
    console.log('Processing complete.');
}

// Run the script
processZipFiles().catch(err => console.error(err));

