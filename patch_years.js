const fs = require('fs');

let js = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', 'utf8');

js = js.replace(
  /<div class="cv-timeline-desc">\$\{years \? years \+ ' Years' : ''\}<\/div>/g,
  '<div class="cv-timeline-desc">${years ? years : \'\'}</div>'
);

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', js);
console.log('Fixed extra Years string');
