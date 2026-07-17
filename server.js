const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const fs = require('fs');


// Initialize Database Schema on Startup
const initDb = async () => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await db.query(schema);
        console.log('Database schema initialized successfully.');
    } catch (err) {
        console.error('Failed to initialize database schema:', err);
    }
};
initDb();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
// Increase limit for base64 image uploads
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve generated PDFs
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// Ensure pdfs directory exists
if (!fs.existsSync(path.join(__dirname, 'pdfs'))) {
    fs.mkdirSync(path.join(__dirname, 'pdfs'));
}

// ----------------------------------------------------
// API: Save CV Data and Generate PDF
// ----------------------------------------------------
app.post('/api/cv', async (req, res) => {
    const client = await db.getClient();
    try {
        const formData = req.body;
        
        await client.query('BEGIN');

        // Insert into candidates table
        const insertCandidateQuery = `
            INSERT INTO candidates (
                full_name, father_name, dob, cnic, gender, nationality, 
                marital_status, religion, languages, objective, skills, 
                hobbies, reference_text, photo_data
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id
        `;
        const candidateValues = [
            formData.fullName, formData.fatherName, formData.dob || null, 
            formData.cnic, formData.gender, formData.nationality, 
            formData.maritalStatus, formData.religion, 
            formData.languages ? formData.languages.join(', ') : '',
            formData.objective, 
            formData.skills ? formData.skills.join(', ') : '',
            formData.hobbies ? formData.hobbies.join(', ') : '',
            formData.referenceText, 
            formData.profilePicData || null
        ];
        // Store address and phone as part of candidate data (we pass them through formData)
        // Note: to permanently store address/phone, run ALTER TABLE candidates ADD COLUMN address TEXT, ADD COLUMN phone VARCHAR(50);

        const resCandidate = await client.query(insertCandidateQuery, candidateValues);
        const candidateId = resCandidate.rows[0].id;

        // Insert Education
        if (formData.education && formData.education.length > 0) {
            const eduQuery = 'INSERT INTO education (candidate_id, degree, board, passing_year) VALUES ($1, $2, $3, $4)';
            for (let edu of formData.education) {
                await client.query(eduQuery, [candidateId, edu.degree, edu.board, edu.year]);
            }
        }

        // Insert Experience
        if (formData.experience && formData.experience.length > 0) {
            const expQuery = 'INSERT INTO experience (candidate_id, years, title, company) VALUES ($1, $2, $3, $4)';
            for (let exp of formData.experience) {
                await client.query(expQuery, [candidateId, exp.years, exp.title, exp.company]);
            }
        }

        await client.query('COMMIT');

        // PDF is generated client-side - server just saves data
        res.json({ 
            success: true, 
            message: 'CV Saved Successfully',
            pdfUrl: null
        });


    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error saving CV:', err);
        res.status(500).json({ success: false, message: err.message });
    } finally {
        client.release();
    }
});

// ----------------------------------------------------
// API: Get Admin Dashboard Data
// ----------------------------------------------------
app.get('/api/stats', async (req, res) => {
    try {
        const countRes = await db.query('SELECT COUNT(*) FROM candidates');
        const count = parseInt(countRes.rows[0].count);

        const recentRes = await db.query('SELECT id, full_name as name, cnic, gender, created_at as timestamp FROM candidates ORDER BY created_at DESC LIMIT 50');
        
        res.json({
            count: count,
            records: recentRes.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// API: Search Candidates
// ----------------------------------------------------
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const searchRes = await db.query(`
            SELECT id, full_name as name, father_name as "fatherName", dob, cnic, skills 
            FROM candidates 
            WHERE full_name ILIKE $1 OR cnic ILIKE $1
            ORDER BY created_at DESC
        `, [`%${query}%`]);
        
        res.json(searchRes.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// API: Delete Candidate
// ----------------------------------------------------
app.delete('/api/cv/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM candidates WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ----------------------------------------------------
// Helper: Generate Navy Blue Two-Column PDF HTML
// ----------------------------------------------------
function generatePDFHtml(data) {
    const navy = '#1a3a6e';
    const blueAccent = '#2563c7';

    // Education timeline rows
    let eduRows = '';
    if (data.education && data.education.length > 0) {
        const filtered = data.education.filter(e => e.degree || e.board || e.year);
        filtered.forEach((e, i) => {
            const isLast = i === filtered.length - 1;
            eduRows += `
            <tr>
              <td style="width:18px;vertical-align:top;padding-top:3px;">
                <div style="width:10px;height:10px;border:2px solid ${blueAccent};border-radius:50%;background:#fff;"></div>
                ${!isLast ? `<div style="width:1.5px;background:#b0c4e8;margin:2px auto 0;height:28px;"></div>` : ''}
              </td>
              <td style="padding-bottom:8px;vertical-align:top;font-size:8.5pt;">
                <strong>${e.degree || 'N/A'}</strong><br>
                <span style="color:${blueAccent};font-weight:600;font-size:8pt;">${e.board || ''}</span><br>
                <span style="color:#666;font-size:7.5pt;">Passing Year: ${e.year || 'N/A'}</span>
              </td>
            </tr>`;
        });
    } else {
        eduRows = '<tr><td colspan="2" style="color:#aaa;font-size:8.5pt;">No education records provided.</td></tr>';
    }

    // Experience timeline rows
    let expRows = '';
    if (data.experience && data.experience.length > 0) {
        const filtered = data.experience.filter(e => e.years || e.title || e.company);
        if (filtered.length > 0) {
            filtered.forEach((e, i) => {
                const isLast = i === filtered.length - 1;
                expRows += `
                <tr>
                  <td style="width:18px;vertical-align:top;padding-top:3px;">
                    <div style="width:10px;height:10px;border:2px solid ${blueAccent};border-radius:50%;background:#fff;"></div>
                    ${!isLast ? `<div style="width:1.5px;background:#b0c4e8;margin:2px auto 0;height:28px;"></div>` : ''}
                  </td>
                  <td style="padding-bottom:8px;vertical-align:top;font-size:8.5pt;">
                    <strong>${e.title || 'N/A'}</strong><br>
                    <span style="color:${blueAccent};font-weight:600;font-size:8pt;">${e.company || ''}</span><br>
                    <span style="color:#666;font-size:7.5pt;">${e.years || ''}</span>
                  </td>
                </tr>`;
            });
        } else {
            expRows = '<tr><td colspan="2" style="font-size:8.5pt;color:#555;">Fresh Candidate</td></tr>';
        }
    } else {
        expRows = '<tr><td colspan="2" style="font-size:8.5pt;color:#555;">Fresh Candidate</td></tr>';
    }

    // Skills, Languages, Hobbies bullet lists
    const skillsList = data.skills && data.skills.length
        ? data.skills.map(s => `<li style="padding:2px 0 2px 14px;position:relative;"><span style="position:absolute;left:0;color:${blueAccent};font-size:11pt;line-height:1;top:1px;">•</span>${s}</li>`).join('')
        : '<li style="color:#aaa;">None</li>';
    const langList = data.languages && data.languages.length
        ? data.languages.map(l => `<li style="padding:2px 0 2px 14px;position:relative;"><span style="position:absolute;left:0;color:${blueAccent};font-size:11pt;line-height:1;top:1px;">•</span>${l}</li>`).join('')
        : '<li style="color:#aaa;">None</li>';
    const hobbyList = data.hobbies && data.hobbies.length
        ? data.hobbies.map(h => `<li style="padding:2px 0 2px 14px;position:relative;"><span style="position:absolute;left:0;color:${blueAccent};font-size:11pt;line-height:1;top:1px;">•</span>${h}</li>`).join('')
        : '<li style="color:#aaa;">None</li>';

    const sectionTitle = (txt) =>
        `<div style="background:${navy};color:#fff;font-size:8.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;padding:5px 9px;margin-bottom:8px;border-radius:2px;">${txt}</div>`;

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; margin:0; padding:0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#222; font-size:9pt; }
        table { border-collapse: collapse; }
        ul { list-style: none; padding: 0; margin: 0; }
      </style>
    </head>
    <body>

      <!-- HEADER -->
      <div style="display:flex;align-items:center;padding:14px 18px 12px 18px;border-bottom:3px solid ${navy};gap:14px;">
        <div style="background:${navy};color:#fff;font-size:14pt;font-weight:900;width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:4px;flex-shrink:0;">CV</div>
        <div style="flex:1;">
          <div style="font-size:17pt;font-weight:800;color:${navy};text-transform:uppercase;letter-spacing:1px;line-height:1.1;">${data.fullName || 'NAME'}</div>
          <div style="font-size:8pt;color:#555;margin-top:3px;">
            ${data.address ? `📍 ${data.address}` : ''}
            ${data.address && data.phone ? '&nbsp;&nbsp;|&nbsp;&nbsp;' : ''}
            ${data.phone ? `📞 ${data.phone}` : ''}
          </div>
        </div>
        ${data.profilePicData ? `<img src="${data.profilePicData}" style="width:60px;height:75px;border:2px solid ${navy};object-fit:cover;border-radius:3px;">` : ''}
      </div>

      <!-- BODY -->
      <table style="width:100%;">
        <tr>

          <!-- LEFT COLUMN -->
          <td style="width:38%;vertical-align:top;padding:14px 10px 14px 14px;border-right:1px solid #dde3ef;">

            <!-- Personal Info -->
            ${sectionTitle('Personal Info')}
            <table style="width:100%;font-size:8.5pt;margin-bottom:12px;">
              <tr><td style="font-weight:700;color:${navy};width:47%;">Father's Name</td><td style="width:5%;">:</td><td>${data.fatherName || '—'}</td></tr>
              <tr><td style="font-weight:700;color:${navy};">Date of Birth</td><td>:</td><td>${data.dob || '—'}</td></tr>
              <tr><td style="font-weight:700;color:${navy};">CNIC</td><td>:</td><td>${data.cnic || '—'}</td></tr>
              <tr><td style="font-weight:700;color:${navy};">Gender</td><td>:</td><td>${data.gender || '—'}</td></tr>
              <tr><td style="font-weight:700;color:${navy};">Nationality</td><td>:</td><td>${data.nationality || 'Pakistani'}</td></tr>
              <tr><td style="font-weight:700;color:${navy};">Marital Status</td><td>:</td><td>${data.maritalStatus || '—'}</td></tr>
              <tr><td style="font-weight:700;color:${navy};">Religion</td><td>:</td><td>${data.religion || '—'}</td></tr>
            </table>

            <!-- Skills -->
            ${sectionTitle('Skills')}
            <ul style="margin-bottom:12px;">${skillsList}</ul>

            <!-- Languages -->
            ${sectionTitle('Languages')}
            <ul style="margin-bottom:12px;">${langList}</ul>

            <!-- Hobbies -->
            ${sectionTitle('Hobbies')}
            <ul style="margin-bottom:12px;">${hobbyList}</ul>

          </td>

          <!-- RIGHT COLUMN -->
          <td style="width:62%;vertical-align:top;padding:14px 14px 14px 12px;">

            <!-- Career Objective -->
            ${sectionTitle('Career Objective')}
            <div style="font-size:8.5pt;line-height:1.55;color:#333;margin-bottom:12px;">${data.objective || ''}</div>

            <!-- Education -->
            ${sectionTitle('Education')}
            <table style="width:100%;margin-bottom:12px;">${eduRows}</table>

            <!-- Work Experience -->
            ${sectionTitle('Work Experience')}
            <table style="width:100%;margin-bottom:12px;">${expRows}</table>

            <!-- Reference -->
            ${sectionTitle('Reference')}
            <div style="font-size:8.5pt;color:#333;">${data.referenceText || 'It will be furnished on demand.'}</div>

          </td>
        </tr>
      </table>

    </body>
    </html>`;
}

