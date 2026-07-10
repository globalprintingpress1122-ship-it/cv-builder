const fs = require('fs');
const path = require('path');

// PATCH APP.JS
let appJS = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', 'utf8');

// 1. Fix addExperience to have Months/Year/Years
appJS = appJS.replace(
  /<div class="form-group">\s*<label>Number of Years<\/label>\s*<input type="text" name="exp_years_\$\{id\}" class="exp-years" placeholder="e.g. 2" oninput="updatePreview\(\)">\s*<\/div>/,
  `<div class="form-group">
    <label>Duration</label>
    <div style="display:flex;gap:0.5rem;">
      <input type="number" name="exp_years_\${id}" class="exp-years-num" placeholder="e.g. 2" style="flex:1" oninput="updatePreview()">
      <select name="exp_unit_\${id}" class="exp-years-unit" style="flex:1" onchange="updatePreview()">
        <option value="Year">Year</option>
        <option value="Years" selected>Years</option>
        <option value="Months">Months</option>
      </select>
    </div>
  </div>`
);

// We need to update how updatePreview() reads experience
const expPreviewOld = /const years = Array\.from\(document\.getElementsByName\(\`exp_years_\$\{id\}\`\)\)\[0\]\?\.value;/g;
appJS = appJS.replace(expPreviewOld, `
      const num = Array.from(document.getElementsByName(\`exp_years_\${id}\`))[0]?.value;
      const unit = Array.from(document.getElementsByName(\`exp_unit_\${id}\`))[0]?.value;
      const years = num ? \`\${num} \${unit}\` : '';
`);

// Fix submitForm to send previewHtml and stop printCV infinite loop
appJS = appJS.replace(
  /const payload = \{[\s\S]*?skills: Array\.from\(document\.querySelectorAll\('input\[name="skills"\]:checked'\)\)\.map\(c => c\.value\)\n  \};/,
  `$&
  // Add the exact HTML of the preview to send to the backend for PDF generation
  payload.previewHtml = document.getElementById('cvPreview').outerHTML;`
);

appJS = appJS.replace(
  /alert\('CV Saved to Database successfully!'\);\s*setTimeout\(printCV, 500\);/,
  `showNotification('CV Generated successfully!');
      if(data.pdfUrl) {
          window.open(data.pdfUrl, '_blank');
      }`
);

// Also remove the infinite loop from printCV itself
appJS = appJS.replace(
  /if \(loading && loading\.classList\.contains\('hidden'\)\) \{\s*submitForm\(\); \/\/ Async save\s*\}/,
  `// Skip auto-save to avoid infinite loop when printCV is triggered from generate`
);

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', appJS);
console.log('app.js patched');

// PATCH SERVER.JS
let serverJS = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/server.js', 'utf8');

// Put puppeteer back in
const serverPuppeteerReplace = `
        // PDF Generation
        const puppeteer = require('puppeteer');
        const pdfFileName = \`\${formData.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_\${Date.now()}.pdf\`;
        const pdfPath = path.join(__dirname, 'pdfs', pdfFileName);
        
        const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
        
        // Wrap the frontend HTML in a basic document with the exact same CSS
        const htmlContent = \`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            \${cssContent}
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
            .cv-preview {
                position: relative !important;
                width: 210mm !important;
                height: 297mm !important;
                padding: 15mm !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                transform: none !important;
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        </head>
        <body>
          \${formData.previewHtml}
        </body>
        </html>
        \`;
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('print');
        await page.pdf({ 
            path: pdfPath, 
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        await browser.close();

        res.json({ 
            success: true, 
            message: 'CV Saved Successfully',
            pdfUrl: \`/pdfs/\${pdfFileName}\`
        });
`;

serverJS = serverJS.replace(
  /\/\/ PDF Generation is handled client-side[\s\S]*?pdfUrl: null\s*\}\);/,
  serverPuppeteerReplace
);

// We need to require fs if not already
if(!serverJS.includes("const fs = require('fs');")) {
    serverJS = "const fs = require('fs');\n" + serverJS;
}

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/server.js', serverJS);
console.log('server.js patched');
