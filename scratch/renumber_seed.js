const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'generate_seed.js'),
  path.join(__dirname, '..', 'backend', 'src', 'config', 'seed.js')
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let count = 0;
    content = content.replace(/code:\s*['"]TSH-PS-[^'"]+['"]/g, () => {
      count++;
      const numStr = String(count).padStart(2, '0');
      return `code: 'TSH-PS-${numStr}'`;
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}: ${count} problem statements renumbered sequentially (TSH-PS-01 to TSH-PS-${String(count).padStart(2, '0')}).`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
