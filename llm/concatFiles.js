const fs = require('fs');
const path = require('path');

const excludedFiles = ['excludeFile.js']; // Add file names to exclude
const excludedFolders = ['node_modules', '.git', 'domains']; // Add folder names to exclude

const outputFile = 'output.txt'; // Output file name
let concatenatedContent = ''; // To store file content for <context>

/**
 * Recursively read directory and concatenate files
 * @param {string} dir - Directory to read
 */
function concatenateFiles(dir) {
  let files = fs.readdirSync(dir);

  files.forEach(file => {
    let fullPath = path.join(dir, file);

    if (excludedFolders.includes(file)) {
      return; // Skip excluded folders
    }

    if (fs.statSync(fullPath).isDirectory()) {
      concatenateFiles(fullPath); // Recurse into subdirectory
    } else if (!excludedFiles.includes(file)) {
      let fileContent = fs.readFileSync(fullPath, 'utf-8');
      let contentWithComment = `// ${fullPath}\n${fileContent}\n\n`;
      concatenatedContent += contentWithComment; // Concatenate file content for <context>
    }
  });
}

/**
 * Initialize concatenation process and replace placeholders in prompt
 * @param {string[]} startPaths - Array of starting directories
 */
function init(startPaths) {
  // Clear existing output file if present
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  // Concatenate files from directories
  startPaths.forEach(startPath => {
    concatenateFiles(startPath);
  });

  // Read schema from schema.txt
  const schema = fs.readFileSync('schema.txt', 'utf-8');
  const prompt = fs.readFileSync('prompt.txt', 'utf-8');

  // Replace <context> and <schema> in the prompt
  const updatedPrompt = prompt
    .replace('<code_format>', concatenatedContent)
    .replace('<schema>', schema);

  // Write the updated prompt to output.txt
  fs.writeFileSync(outputFile, updatedPrompt, 'utf-8');
}

// Example usage: pass an array of paths
init(['./../apps/task-management-service/src/domains']);
