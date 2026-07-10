const fs = require('fs');

// 1. Add .gitignore
fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/.gitignore', 'node_modules\n.env\npdfs/\n');

// 2. Modify server.js for ENV variables
let serverJS = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/server.js', 'utf8');

// Replace DB credentials with process.env.DATABASE_URL support
const dbRegex = /const db = new Pool\(\{[\s\S]*?\}\);/;
const dbReplacement = `const db = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cvbuilder',
    password: process.env.DB_PASSWORD || '1122',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});`;
serverJS = serverJS.replace(dbRegex, dbReplacement);

// Replace PORT
serverJS = serverJS.replace(/const PORT = 8080;/, 'const PORT = process.env.PORT || 8080;');

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/server.js', serverJS);
console.log('Server prepared for cloud.');
