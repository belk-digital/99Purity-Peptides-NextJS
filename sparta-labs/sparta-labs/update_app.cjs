const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');

// Find the start and end indices
const startIndex = lines.findIndex(line => line.includes('{/* Hero Section */}'));
const endIndex = lines.findIndex((line, index) => index > startIndex && line.includes('      <BenefitsSection />'));

if (startIndex !== -1 && endIndex !== -1) {
  // We want to replace everything from startIndex to endIndex - 1 (inclusive)
  lines.splice(startIndex, endIndex - startIndex, '      <HeroSection />\n');
}

// Add import
const importIndex = lines.findIndex(line => line.includes('import DifferenceSection'));
if (importIndex !== -1) {
  lines.splice(importIndex + 1, 0, "import HeroSection from './HeroSection';");
}

fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('App.jsx updated successfully.');
