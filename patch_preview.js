const fs = require('fs');
let js = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', 'utf8');

js = js.replace(/const yearsEl = expList\[i\]\.querySelector\('\.exp-years'\);\s*const titleEl = expList\[i\]\.querySelector\('\.exp-title'\);\s*const companyEl = expList\[i\]\.querySelector\('\.exp-company'\);\s*const years = yearsEl \? yearsEl\.value : '';/, `
          const yearsNumEl = expList[i].querySelector('.exp-years-num');
          const yearsUnitEl = expList[i].querySelector('.exp-years-unit');
          const titleEl = expList[i].querySelector('.exp-title');
          const companyEl = expList[i].querySelector('.exp-company');
          
          const num = yearsNumEl ? yearsNumEl.value : '';
          const unit = yearsUnitEl ? yearsUnitEl.value : '';
          const years = num ? \`\${num} \${unit}\` : '';
`);

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', js);
console.log('Fixed updatePreview for experience years');
