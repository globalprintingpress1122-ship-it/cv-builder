const fs = require('fs');

let serverJS = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/server.js', 'utf8');

// Update puppeteer.launch to use system chromium on Railway
serverJS = serverJS.replace(
    `const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });`,
    `const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXEC_PATH || puppeteer.executablePath(),
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process', '--no-zygote']
        });`
);

// Also make pdfs directory if not exists
if (!serverJS.includes("fs.mkdirSync")) {
    serverJS = serverJS.replace(
        "const initDb = async",
        `// Ensure pdfs directory exists
const pdfsDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
}

const initDb = async`
    );
}

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/server.js', serverJS);
console.log('Server updated for Railway Chromium');
