const fs = require('fs');
const path = require('path');

// Function to parse the input content
function parseContent(inputContent) {
  // Split the content by the lines starting with '// '
  const blocks = inputContent.split('\n// ').slice(1);

  // Process each block to separate the file path and its content
  return blocks.map(block => {
    const [filePathLine, ...fileContentLines] = block.split('\n');
    const filePath = filePathLine.trim();
    const content = fileContentLines.join('\n').trim();
    return { filePath, content };
  });
}

// Function to write the parsed content to the file system
function createFiles(parsedFiles) {
  parsedFiles.forEach(file => {
    const dir = path.dirname(file.filePath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the content to the file
    fs.writeFileSync(file.filePath, file.content, 'utf-8');
    console.log(`File created: ${file.filePath}`);
  });
}

// Function to read the input file and execute the logic
function processInputFile(inputFilePath) {
  // Read the input file
  const inputContent = fs.readFileSync(inputFilePath, 'utf-8');

  // Parse the content
  const parsedFiles = parseContent(inputContent);

  // Create files on the disk
  createFiles(parsedFiles);
}

// Call this function with the path to your input file
processInputFile('./input.txt');
