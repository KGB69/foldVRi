import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Build verification script running...');

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ dist directory exists');
  
  // List contents of dist directory
  const files = fs.readdirSync(distPath);
  console.log(`Found ${files.length} files/directories in dist:`);
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'}, ${stats.size} bytes)`);
  });
  
  // Check for index.html
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html exists in dist directory');
  } else {
    console.error('❌ index.html does not exist in dist directory');
  }
} else {
  console.error('❌ dist directory does not exist');
}

// Check package.json for build script
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`✅ build script exists in package.json: "${packageJson.scripts.build}"`);
  } else {
    console.error('❌ No build script found in package.json');
  }
} else {
  console.error('❌ package.json not found');
}

console.log('Build verification complete');
