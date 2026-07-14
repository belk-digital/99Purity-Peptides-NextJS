import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');
const searchString = '/99 Blog Images/';
const replacementString = 'https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/blog-images/';

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchString)) {
    content = content.replaceAll(searchString, replacementString);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
    return true;
  }
  return false;
};

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updatedCount += processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (replaceInFile(fullPath)) {
        updatedCount++;
      }
    }
  }
  return updatedCount;
};

const count = processDirectory(dataDir);
console.log(`Total files updated: ${count}`);
