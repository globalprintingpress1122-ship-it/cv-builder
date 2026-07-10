const fs = require('fs');
let js = fs.readFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', 'utf8');

// Replace submitForm entirely
js = js.replace(/function submitForm\(\) \{[\s\S]*?function onSuccess\(response\) \{/, `
async function submitForm() {
  showLoading('Saving data and generating PDF...');
  
  const payload = {
    fullName: document.getElementById('fullName').value,
    fatherName: document.getElementById('fatherName').value,
    dob: document.getElementById('dob').value,
    cnic: document.getElementById('cnic').value,
    gender: document.getElementById('gender').value,
    nationality: document.getElementById('nationality').value,
    maritalStatus: document.getElementById('maritalStatus').value,
    religion: document.getElementById('religion').value,
    objective: document.getElementById('objective').value,
    referenceText: document.getElementById('referenceText').value,
    profilePicData: document.getElementById('profilePicData').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    languages: Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(c => c.value),
    skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(c => c.value)
  };

  try {
    const res = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    hideLoading();
    if (data.success) {
      alert('CV Saved to Database successfully!');
      setTimeout(printCV, 500); // Trigger client-side print
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    hideLoading();
    alert('Network Error: ' + err.message);
  }
}
function onSuccess(response) {
`);

// Replace searchDb entirely
js = js.replace(/function searchDb\(\) \{[\s\S]*?function loadSavedCv\(id\)/, `
async function searchDb() {
  const query = document.getElementById('dbSearchInput').value;
  if (!query) return;
  
  const container = document.getElementById('dbSearchResults');
  container.innerHTML = 'Loading...';
  container.style.display = 'block';

  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(query));
    const data = await res.json();
    container.innerHTML = '';
    if (data.length === 0) {
      container.innerHTML = '<div style="padding:10px; color:#64748b; font-size:0.9rem;">No CVs found.</div>';
    } else {
      data.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 10px; border-bottom: 1px solid #e2e8f0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
        div.innerHTML = '<div style="font-weight:600;">' + item.name + '</div><div style="font-size:0.8rem;">' + item.cnic + '</div>';
        div.onclick = () => alert('Loading from DB not yet implemented');
        container.appendChild(div);
      });
    }
  } catch (err) {
    container.innerHTML = 'Error searching.';
  }
}
function loadSavedCv(id)
`);

fs.writeFileSync('C:/Users/SK/.gemini/antigravity/scratch/cv-builder-pg/public/app.js', js);
console.log('App patched.');
