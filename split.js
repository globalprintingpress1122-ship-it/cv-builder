const fs = require('fs');

const nkPath = 'C:/Users/SK/Desktop/NK/Index.html';
const content = fs.readFileSync(nkPath, 'utf8');

// Extract CSS
const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/styles.css', cssMatch[1].trim());
}

// Extract JS
const jsMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (jsMatch) {
  let jsContent = jsMatch[1].trim();
  fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', jsContent);
}

// Extract HTML body (excluding style and script)
let htmlContent = content.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="styles.css">');
htmlContent = htmlContent.replace(/<script>[\s\S]*?<\/script>/, '<script src="app.js"></script>');
fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/index.html', htmlContent);

console.log('Files separated successfully.');
