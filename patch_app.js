const fs = require('fs');
let js = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', 'utf8');

// Replace the google.script.run logic in submitForm
const searchBlock = `if (typeof google !== 'undefined' && google.script && google.script.run) {`;
const replaceBlock = `
      try {
        const response = await fetch('/api/cv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        hideLoading();
        if(data.success) {
            showNotification('CV Generated successfully!');
            if(data.pdfUrl) {
                window.open(data.pdfUrl, '_blank');
            }
        } else {
            alert('Error: ' + data.message);
        }
      } catch(error) {
        hideLoading();
        alert('Network/Server Error: ' + error.message);
      }
      
      /* 
`;
js = js.replace(searchBlock, replaceBlock);
// comment out the else part that uses localstorage
js = js.replace(/\} else \{[\s\S]*?\/\/ --- Toast/, '} */ \n// --- Toast');
js = js.replace('function submitForm()', 'async function submitForm()');

// Replace searchDb function
const searchDbNew = `
async function searchDb() {
  const query = document.getElementById('dbSearchInput').value;
  if (!query) return;
  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(query));
    const data = await res.json();
    const container = document.getElementById('dbSearchResults');
    container.innerHTML = '';
    if (data.length === 0) {
      container.innerHTML = '<div style="padding:10px; color:#64748b; font-size:0.9rem;">No CVs found.</div>';
    } else {
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'db-search-item';
        div.style.cssText = 'padding: 10px; border-bottom: 1px solid #e2e8f0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
        div.innerHTML = '<div style="font-size:0.9rem;font-weight:600;color:#0f172a;">' + item.name + '</div><div style="font-size:0.8rem;color:#64748b;">' + item.cnic + '</div>';
        div.onclick = () => loadSavedCv(item.id);
        container.appendChild(div);
      });
    }
    container.style.display = 'block';
  } catch(e) {
    console.error(e);
  }
}
function old_searchDb()`;
js = js.replace('function searchDb()', searchDbNew);

// Load CV function
const loadCvNew = `
async function loadSavedCv(id) {
    alert('Loading from PostgreSQL not fully implemented in UI yet.');
}
function old_loadSavedCv(id)`;
js = js.replace('function loadSavedCv(id)', loadCvNew);

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', js);
console.log('App.js patched successfully');
