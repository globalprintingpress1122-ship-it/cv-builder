const fs = require('fs');

let appJS = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', 'utf8');

appJS = appJS.replace(/function printCV\(\) \{[\s\S]*?printWindow\.document\.close\(\);\s*\}/, `
function printCV() {
      // Just call submitForm to use the perfect backend PDF generation
      const form = document.getElementById('cvForm');
      if (form.checkValidity()) {
        submitForm(); 
      } else {
        alert("Please fill in required fields (Name and Phone) before printing to ensure your CV is saved correctly.");
        form.reportValidity();
      }
}
`);

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', appJS);
console.log('printCV patched successfully');
