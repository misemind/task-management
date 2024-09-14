const fs = require('fs');
const path = require('path');

// Configuration
const appAlias = '@app'; // Configurable alias to replace 'src'

// Function to convert 'src' paths to '@app' paths
function convertSrcPathToAppAlias(importPath) {
    if (importPath.startsWith('src/')) {
        return importPath.replace('src/', `${appAlias}/`);
    }
    return importPath;
}

// Function to process each file
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/(import\s.+?['"])(src\/.*?['"])/g, (match, p1, p2) => {
        const importPath = p2.slice(0, -1); // Remove the trailing quote
        const newImportPath = convertSrcPathToAppAlias(importPath);
        return `${p1}${newImportPath}'`; // Add the trailing quote back
    });

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated imports in ${filePath}`);
    }
}

// Function to recursively find and process all TypeScript files in a directory
function processDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.ts')) {
            processFile(fullPath);
        }
    });
}

// Starting point: process the src directory
processDirectory(path.join(__dirname, './apps/server/src'));
