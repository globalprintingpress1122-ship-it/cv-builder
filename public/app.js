let eduCount = 0;
    let expCount = 0;
    let hobbyCount = 0;

    const DEGREE_OPTIONS = [
      'No Qualification', 'Primary', 'Middle', 'Matric', 'Intermediate',
      'I.Com', 'D.Com', 'B.Com', 'B.A', 'B.Sc', 'BS',
      'MA', 'MSc', 'M.Com', 'MBA', 'Other (Type Below)'
    ];

    document.addEventListener('DOMContentLoaded', function() {
      // Initial setup
      addEducation();
      addExperience();
      addHobby();
      updatePreview();

      document.getElementById('cvForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
      });
    });

    function addEducation() {
      eduCount++;
      const id = eduCount;
      const container = document.getElementById('educationList');
      let optionsHtml = DEGREE_OPTIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.id = `edu-${id}`;
      div.innerHTML = `
        <button type="button" class="btn btn-danger" onclick="removeEducation(${id})">X</button>
        <div class="form-group">
          <label>Degree / Qualification</label>
          <select name="edu_degree_${id}" class="edu-degree" onchange="handleDegreeChange(this, ${id})">
            <option value="">Select Degree</option>
            ${optionsHtml}
          </select>
          <input type="text" name="edu_degree_custom_${id}" class="edu-degree-custom" placeholder="Type custom degree here..." oninput="updatePreview()" style="display:none; margin-top:6px;">
        </div>
        <div class="form-group">
          <label>Board / University</label>
          <input type="text" name="edu_board_${id}" class="edu-board" placeholder="e.g. BISE Lahore" oninput="updatePreview()">
        </div>
        <div class="form-group">
          <label>Passing Year</label>
          <input type="text" name="edu_year_${id}" class="edu-year" placeholder="e.g. 2020" oninput="updatePreview()">
        </div>
      `;
      container.appendChild(div);
      updatePreview();
    }

    function removeEducation(id) {
      const el = document.getElementById(`edu-${id}`);
      if (el) { el.remove(); updatePreview(); }
    }

    function handleDegreeChange(selectEl, id) {
      const customInput = selectEl.closest('.dynamic-item').querySelector('.edu-degree-custom');
      if (selectEl.value === 'Other (Type Below)') {
        customInput.style.display = 'block';
      } else {
        customInput.style.display = 'none';
        customInput.value = '';
      }
      updatePreview();
    }

    function addExperience() {
      expCount++;
      const id = expCount;
      const container = document.getElementById('experienceList');
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.id = `exp-${id}`;
      div.innerHTML = `
        <button type="button" class="btn btn-danger" onclick="removeExperience(${id})">X</button>
        <div class="form-group">
          <label>Experience Type</label>
          <select name="exp_type_${id}" class="exp-type" onchange="handleExpTypeChange(this, ${id})">
            <option value="">Select Type</option>
            <option value="Fresh Candidate">Fresh Candidate (No Experience)</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>
        <div class="exp-detail-fields" id="exp-details-${id}" style="display:none;">
          <div class="form-group">
    <label>Duration</label>
    <div style="display:flex;gap:0.5rem;">
      <input type="number" name="exp_years_${id}" class="exp-years-num" placeholder="e.g. 2" style="flex:1" oninput="updatePreview()">
      <select name="exp_unit_${id}" class="exp-years-unit" style="flex:1" onchange="updatePreview()">
        <option value="Year">Year</option>
        <option value="Years" selected>Years</option>
        <option value="Months">Months</option>
      </select>
    </div>
  </div>
          <div class="form-group">
            <label>Designation / Job Title</label>
            <input type="text" name="exp_title_${id}" class="exp-title" placeholder="e.g. Salesman" oninput="updatePreview()">
          </div>
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" name="exp_company_${id}" class="exp-company" placeholder="e.g. Al Fatah Store" oninput="updatePreview()">
          </div>
        </div>
      `;
      container.appendChild(div);
      updatePreview();
    }

    function handleExpTypeChange(selectEl, id) {
      const detailFields = document.getElementById(`exp-details-${id}`);
      if (selectEl.value === 'Experienced') {
        detailFields.style.display = 'block';
      } else {
        detailFields.style.display = 'none';
        // Clear fields
        const item = selectEl.closest('.dynamic-item');
        item.querySelectorAll('.exp-years, .exp-title, .exp-company').forEach(el => el.value = '');
      }
      updatePreview();
    }

    function removeExperience(id) {
      const el = document.getElementById(`exp-${id}`);
      if (el) {
        el.remove();
        updatePreview();
      }
    }

    function addHobby() {
      hobbyCount++;
      const id = hobbyCount;
      const container = document.getElementById('hobbiesList');
      
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.id = `hobby-${id}`;
      div.innerHTML = `
        <button type="button" class="btn btn-danger" onclick="removeHobby(${id})">X</button>
        <div class="form-group" style="margin-bottom:0;">
          <label>Hobby / Interest</label>
          <input type="text" name="hobby_val_${id}" class="hobby-val" placeholder="e.g. Reading Books" oninput="updatePreview()">
        </div>
      `;
      container.appendChild(div);
      updatePreview();
    }

    function removeHobby(id) {
      const el = document.getElementById('hobby-' + id);
      if (el) {
        el.remove();
        updatePreview();
      }
    }

    function updatePreview() {
      // Name
      document.getElementById('previewName').innerText = document.getElementById('fullName').value || 'YOUR NAME HERE';
      
      // Personal Details - Father/Husband
      const fatherHusbandType = document.getElementById('fatherHusbandType').value;
      const fatherHusbandVal = document.getElementById('fatherName').value;
      // Update the preview label text (Father's Name or Husband's Name)
      const previewLabelEl = document.getElementById('previewFatherLabel');
      if (previewLabelEl) previewLabelEl.innerText = fatherHusbandType === 'Husband' ? "Husband's Name" : "Father's Name";
      document.getElementById('previewFatherName').innerText = fatherHusbandVal || 'N/A';
      
      const dobValue = document.getElementById('dob').value;
      document.getElementById('previewDOB').innerText = dobValue ? new Date(dobValue).toLocaleDateString() : 'N/A';
      
      document.getElementById('previewCNIC').innerText = document.getElementById('cnic').value || 'N/A';
      document.getElementById('previewGender').innerText = document.getElementById('gender').value || 'N/A';
      document.getElementById('previewNationality').innerText = document.getElementById('nationality').value || 'Pakistani';
      document.getElementById('previewMaritalStatus').innerText = document.getElementById('maritalStatus').value || 'N/A';
      document.getElementById('previewReligion').innerText = document.getElementById('religion').value || 'N/A';
      
      // Languages - update both personal info row AND separate Languages section
      const langs = Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value);
      const previewLangEl = document.getElementById('previewLanguages');
      if (previewLangEl) {
        previewLangEl.innerText = langs.length > 0 ? langs.join(', ') : 'N/A';
      }
      const langListEl = document.getElementById('previewLanguagesList');
      if (langListEl) {
        langListEl.innerHTML = langs.length > 0 ? langs.map(l => `<li>${l}</li>`).join('') : '<li style="list-style:none;padding-left:0;color:#64748b;font-style:italic;">None</li>';
      }

      // Objective & Reference
      document.getElementById('previewObjective').innerText = document.getElementById('objective').value || 'No objective statement.';
      document.getElementById('previewReference').innerText = document.getElementById('referenceText').value || 'It will be furnished on demand.';

      // Dynamic Address & Phone row under Name header (Self-formatting)
      const address = document.getElementById('address').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email') ? document.getElementById('email').value : '';
      let contactHtml = '';
      if (address) {
        contactHtml += `<span style="display: flex; align-items: center; gap: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${address}</span>`;
      }
      if (phone) {
        if (contactHtml) contactHtml += `<span style="color:#cbd5e1;">|</span>`;
        contactHtml += `<span style="display: flex; align-items: center; gap: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> ${phone}</span>`;
      }
      if (email) {
        if (contactHtml) contactHtml += `<span style="color:#cbd5e1;">|</span>`;
        contactHtml += `<span style="display: flex; align-items: center; gap: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> ${email}</span>`;
      }
      document.getElementById('previewContactDetails').innerHTML = contactHtml;

      // Picture Conditional Visibility (pic agr nahi lagi ho to print aur preview mein bilkul khali ho)
      const photoData = document.getElementById('profilePicData').value;
      const photoContainer = document.querySelector('.cv-photo-container');
      const cvHeader = document.querySelector('.cv-header');
      const previewPhoto = document.getElementById('previewPhoto');
      const photoIcon = document.getElementById('photoPlaceholderIcon');
      
      if (photoData) {
        photoContainer.style.display = 'flex';
        previewPhoto.src = photoData;
        previewPhoto.style.display = 'block';
        if (photoIcon) photoIcon.style.display = 'none';
      } else {
        photoContainer.style.display = 'none'; // Completely hidden (no borders, no placeholder)
      }

      // Education Preview
      const eduList = document.getElementById('educationList').children;
      let eduHtml = '';
      let hasEdu = false;
      for (let i = 0; i < eduList.length; i++) {
        const degreeEl = eduList[i].querySelector('.edu-degree');
        const customDegreeEl = eduList[i].querySelector('.edu-degree-custom');
        const boardEl = eduList[i].querySelector('.edu-board');
        const yearEl = eduList[i].querySelector('.edu-year');
        
        let degree = degreeEl ? degreeEl.value : '';
        // If 'Other (Type Below)' selected, use custom text
        if (degree === 'Other (Type Below)' && customDegreeEl && customDegreeEl.value.trim()) {
          degree = customDegreeEl.value.trim();
        }
        const board = boardEl ? boardEl.value : '';
        const year = yearEl ? yearEl.value : '';
        
        if (degree || board || year) {
          hasEdu = true;
          // If No Qualification - only show that, skip board/year
          if (degree === 'No Qualification') {
            eduHtml += `
              <div class="cv-timeline-item">
                <div class="cv-timeline-title">No Qualification</div>
              </div>
            `;
          } else {
            eduHtml += `
              <div class="cv-timeline-item">
                <div class="cv-timeline-title">${degree || 'Qualification'}</div>
                <div class="cv-timeline-subtitle">${board || 'Board / University'}</div>
                <div class="cv-timeline-desc">${year ? 'Passing Year: ' + year : ''}</div>
              </div>
            `;
          }
        }
      }
      
      const previewEduContainer = document.getElementById('previewEducation');
      if (hasEdu) {
        previewEduContainer.className = 'cv-timeline';
        previewEduContainer.innerHTML = eduHtml;
      } else {
        previewEduContainer.className = '';
        previewEduContainer.innerHTML = '<div style="color:#64748b;font-style:italic;">No education records added.</div>';
      }

      // Experience Preview
      const expList = document.getElementById('experienceList').children;
      let expHtml = '';
      let hasExperience = false;
      for (let i = 0; i < expList.length; i++) {
        const typeEl = expList[i].querySelector('.exp-type');
        const expType = typeEl ? typeEl.value : '';
        
        if (expType === 'Fresh Candidate') {
          hasExperience = true;
          expHtml += `
            <div class="cv-timeline-item">
              <div class="cv-timeline-title">Fresh Candidate</div>
              <div class="cv-timeline-subtitle">No prior work experience</div>
            </div>
          `;
        } else if (expType === 'Experienced') {
          
          const yearsNumEl = expList[i].querySelector('.exp-years-num');
          const yearsUnitEl = expList[i].querySelector('.exp-years-unit');
          const titleEl = expList[i].querySelector('.exp-title');
          const companyEl = expList[i].querySelector('.exp-company');
          
          const num = yearsNumEl ? yearsNumEl.value : '';
          const unit = yearsUnitEl ? yearsUnitEl.value : '';
          const years = num ? `${num} ${unit}` : '';

          const title = titleEl ? titleEl.value : '';
          const company = companyEl ? companyEl.value : '';
          if (years || title || company) {
            hasExperience = true;
            expHtml += `
              <div class="cv-timeline-item">
                <div class="cv-timeline-title">${title || 'Designation'}</div>
                <div class="cv-timeline-subtitle">${company || 'Company'}</div>
                <div class="cv-timeline-desc">${years ? years : ''}</div>
              </div>
            `;
          }
        }
      }
      
      const previewExpContainer = document.getElementById('previewExperience');
      if (hasExperience) {
        previewExpContainer.className = 'cv-timeline';
        previewExpContainer.innerHTML = expHtml;
      } else {
        previewExpContainer.className = '';
        previewExpContainer.innerHTML = '<div style="color:#64748b;font-style:italic;">Add experience above.</div>';
      }

      // Skills & Hobbies
      const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);
      document.getElementById('previewSkills').innerHTML = skills.length > 0 ? skills.map(s => `<li>${s}</li>`).join('') : '<li style="list-style:none;padding-left:0;color:#64748b;font-style:italic;">None</li>';

      const hobbiesListEl = document.getElementById('hobbiesList').children;
      const dynamicHobbies = [];
      for (let i = 0; i < hobbiesListEl.length; i++) {
        const valEl = hobbiesListEl[i].querySelector('.hobby-val');
        if (valEl && valEl.value.trim()) {
          dynamicHobbies.push(valEl.value.trim());
        }
      }
      document.getElementById('previewHobbies').innerHTML = dynamicHobbies.length > 0 ? dynamicHobbies.map(h => `<li>${h}</li>`).join('') : '<li style="list-style:none;padding-left:0;color:#64748b;font-style:italic;">None</li>';
    }

    function formatCNIC(input) {
      // Remove all non-digit characters
      let digits = input.value.replace(/\D/g, '');
      // Limit to 13 digits
      digits = digits.substring(0, 13);
      // Apply format XXXXX-XXXXXXX-X
      let formatted = digits;
      if (digits.length > 5) {
        formatted = digits.substring(0, 5) + '-' + digits.substring(5);
      }
      if (digits.length > 12) {
        formatted = digits.substring(0, 5) + '-' + digits.substring(5, 12) + '-' + digits.substring(12);
      }
      input.value = formatted;
      updatePreview();
    }

    function handleImageUpload(event) {
      const file = event.target.files[0];
      const previewPhoto = document.getElementById('previewPhoto');
      const photoIcon = document.getElementById('photoPlaceholderIcon');
      const dataInput = document.getElementById('profilePicData');
      const nameInput = document.getElementById('profilePicName');

      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewPhoto.src = e.target.result;
          previewPhoto.style.display = 'block';
          if (photoIcon) photoIcon.style.display = 'none';
          dataInput.value = e.target.result;
          nameInput.value = file.name;
          updatePreview();
        };
        reader.readAsDataURL(file);
      } else {
        previewPhoto.src = '';
        previewPhoto.style.display = 'none';
        if (photoIcon) photoIcon.style.display = 'block';
        dataInput.value = '';
        nameInput.value = '';
        updatePreview();
      }
    }

    
function printCV() {
  const cvElement = document.getElementById('cvPreview');
  const previewContent = cvElement.innerHTML;

  let stylesContent = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => {
    stylesContent += el.outerHTML;
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print your CV.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV Print</title>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        ${stylesContent}
        <style>
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .cv-preview {
            position: absolute !important;
            left: 0 !important; top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 15mm !important;
            border: none !important;
            box-shadow: none !important;
            transform: none !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            overflow: visible !important;
            background: white !important;
          }
        </style>
      </head>
      <body>
        <div class="cv-preview">${previewContent}</div>
        <script>
          window.addEventListener('load', function() {
            setTimeout(function() { window.print(); }, 500);
          });
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}



    function exportDatabase() {
      const localDB = localStorage.getItem('mock_cv_database') || '[]';
      const blob = new Blob([localDB], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_Database_Backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification("Database backup file downloaded!");
    }

    function importDatabase(input) {
      const file = input.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const parsed = JSON.parse(e.target.result);
          if (Array.isArray(parsed)) {
            if (confirm("Do you want to MERGE with existing CVs? (Click 'Cancel' to overwrite/replace everything instead)")) {
              let localDB = JSON.parse(localStorage.getItem('mock_cv_database') || '[]');
              parsed.forEach(item => {
                if (item && (item.fullName || item.name)) {
                  const duplicateIndex = localDB.findIndex(x => (x.cnic && x.cnic === item.cnic) || x.name === item.name);
                  if (duplicateIndex === -1) {
                    localDB.push(item);
                  } else {
                    localDB[duplicateIndex] = item;
                  }
                }
              });
              localStorage.setItem('mock_cv_database', JSON.stringify(localDB));
              alert("Successfully imported and merged database!");
            } else if (confirm("Are you sure you want to REWRITE (delete all current saved CVs and replace with this backup)?")) {
              localStorage.setItem('mock_cv_database', JSON.stringify(parsed));
              alert("Database overwritten successfully with backup data!");
            }
            input.value = '';
            searchDb();
          } else {
            alert("Invalid backup file format. Must be a JSON array of CV profiles.");
          }
        } catch (err) {
          alert("Error reading backup file: " + err.message);
        }
      };
      reader.readAsText(file);
    }

    function resetForm() {
      if(confirm('Are you sure you want to reset the form?')) {
        document.getElementById('cvForm').reset();
        
        // Reset tracking fields
        document.getElementById('recordId').value = '';
        document.getElementById('btnGenerate').innerText = "Generate & Save CV";
        
        const previewPhoto = document.getElementById('previewPhoto');
        const photoIcon = document.getElementById('photoPlaceholderIcon');
        if (previewPhoto) previewPhoto.style.display = 'none';
        if (photoIcon) photoIcon.style.display = 'block';
        
        document.getElementById('educationList').innerHTML = '';
        document.getElementById('experienceList').innerHTML = '';
        eduCount = 0;
        expCount = 0;
        hobbyCount = 0;
        addEducation();
        addExperience();
        addHobby();
        updatePreview();
      }
    }

    // --- Search & Database Loading Logic ---
    function searchDb() {
      const query = document.getElementById('dbSearchInput').value.trim();
      if (!query) return;
      
      const resultsContainer = document.getElementById('dbSearchResults');
      resultsContainer.innerHTML = '<div style="padding:12px;color:#64748b;font-size:0.9rem;">Searching database...</div>';
      resultsContainer.style.display = 'block';
      
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(displayDbResults)
          .withFailureHandler(function(err) {
             resultsContainer.innerHTML = `<div style="padding:12px;color:#ef4444;font-size:0.9rem;">Server Error: ${err.message}</div>`;
          })
          .searchCandidates(query);
      } else {
        // Mock DB query (Offline local mode)
        const localDB = JSON.parse(localStorage.getItem('mock_cv_database') || '[]');
        const q = query.toLowerCase();
        const results = localDB.filter(rec => 
          rec.name.toLowerCase().includes(q) || 
          (rec.cnic && rec.cnic.toLowerCase().includes(q))
        );
        displayDbResults(results);
      }
    }

    function displayDbResults(results) {
      const container = document.getElementById('dbSearchResults');
      container.innerHTML = '';
      
      if (results.length === 0) {
        container.innerHTML = '<div style="padding:12px;color:#64748b;font-size:0.9rem;">No candidate records found.</div>';
        return;
      }
      
      results.forEach(res => {
        const item = document.createElement('div');
        item.className = 'db-search-item';
        item.style.cssText = 'padding:10px 14px;border-bottom:1px solid #cbd5e1;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:0.9rem;background:white;transition: background 0.15s;';
        item.innerHTML = `
          <div>
            <strong>${res.name}</strong> &bull; <span style="color:#64748b;font-size:0.8rem;">CNIC: ${res.cnic || 'N/A'}</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:0.75rem;" onclick="loadRecordForEditing(${res.id})">Load & Edit</button>
        `;
        container.appendChild(item);
      });
    }

    function loadRecordForEditing(id) {
      showLoading("Loading candidate profile...");
      document.getElementById('dbSearchResults').style.display = 'none';
      document.getElementById('dbSearchInput').value = '';
      
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(populateFormWithData)
          .withFailureHandler(function(err) {
             hideLoading();
             alert("Error loading record: " + err.message);
          })
          .getCandidateDetails(id);
      } else {
        // Mock DB load
        const localDB = JSON.parse(localStorage.getItem('mock_cv_database') || '[]');
        const record = localDB.find(rec => rec.id == id);
        
        if (record && record.fullPayload) {
          populateFormWithData({
            success: true,
            id: id,
            ...record.fullPayload
          });
        } else {
          hideLoading();
          alert("Error: Mock profile details not found in offline DB.");
        }
      }
    }

    function populateFormWithData(data) {
      hideLoading();
      if (!data.success) {
        alert("Error loading profile: " + data.message);
        return;
      }
      
      // Set update state tracker
      document.getElementById('recordId').value = data.id;
      document.getElementById('btnGenerate').innerText = "Update & Save CV";
      
      // Populate fields
      document.getElementById('fullName').value = data.fullName || '';
      document.getElementById('fatherName').value = data.fatherName || '';
      document.getElementById('fatherHusbandType').value = data.fatherHusbandType || 'Father';
      document.getElementById('dob').value = data.dob || '';
      document.getElementById('cnic').value = data.cnic || '';
      document.getElementById('gender').value = data.gender || '';
      document.getElementById('nationality').value = data.nationality || 'Pakistani';
      document.getElementById('maritalStatus').value = data.maritalStatus || '';
      document.getElementById('religion').value = data.religion || '';
      document.getElementById('objective').value = data.objective || '';
      document.getElementById('referenceText').value = data.referenceText || '';
      document.getElementById('phone').value = data.phone || '';
      document.getElementById('address').value = data.address || '';
      
      // Checkboxes
      const langCheckboxes = document.querySelectorAll('input[name="languages"]');
      langCheckboxes.forEach(cb => {
        cb.checked = data.languages ? data.languages.includes(cb.value) : false;
      });
      
      const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
      skillCheckboxes.forEach(cb => {
        cb.checked = data.skills ? data.skills.includes(cb.value) : false;
      });
      
      const hobbyContainer = document.getElementById('hobbiesList');
      hobbyContainer.innerHTML = '';
      hobbyCount = 0;
      if (data.hobbies && data.hobbies.length > 0) {
        data.hobbies.forEach(hobby => {
          addHobby();
          const currentId = hobbyCount;
          const valEl = hobbyContainer.querySelector(`[name="hobby_val_${currentId}"]`);
          if (valEl) valEl.value = hobby;
        });
      } else {
        addHobby();
      }
      
      // Profile Picture
      document.getElementById('profilePicData').value = data.profilePicData || '';
      document.getElementById('profilePicName').value = '';
      document.getElementById('profilePic').value = '';
      
      // Education Rows
      const eduContainer = document.getElementById('educationList');
      eduContainer.innerHTML = '';
      eduCount = 0;
      
      if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
          addEducation();
          const currentId = eduCount;
          const degreeEl = eduContainer.querySelector(`[name="edu_degree_${currentId}"]`);
          const boardEl = eduContainer.querySelector(`[name="edu_board_${currentId}"]`);
          const yearEl = eduContainer.querySelector(`[name="edu_year_${currentId}"]`);
          
          if (degreeEl) degreeEl.value = edu.degree;
          if (boardEl) boardEl.value = edu.board;
          if (yearEl) yearEl.value = edu.year;
        });
      } else {
        addEducation();
      }
      
      // Experience Rows
      const expContainer = document.getElementById('experienceList');
      expContainer.innerHTML = '';
      expCount = 0;
      
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
          addExperience();
          const currentId = expCount;
          const yearsEl = expContainer.querySelector(`[name="exp_years_${currentId}"]`);
          const titleEl = expContainer.querySelector(`[name="exp_title_${currentId}"]`);
          const companyEl = expContainer.querySelector(`[name="exp_company_${currentId}"]`);
          
          if (yearsEl) yearsEl.value = exp.years;
          if (titleEl) titleEl.value = exp.title;
          if (companyEl) companyEl.value = exp.company;
        });
      } else {
        addExperience();
      }
      
      // Refresh preview tayaar
      updatePreview();
      showNotification("Candidate details loaded!");
    }

    
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
  // Add the exact HTML of the preview to send to the backend for PDF generation
  payload.previewHtml = document.getElementById('cvPreview').outerHTML;

  try {
    const res = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    hideLoading();
    if (data.success) {
      hideLoading();
      showNotification('CV Database mein Save ho gaya! ✅');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    hideLoading();
    alert('Network Error: ' + err.message);
  }
}



function onSuccess(response) {

      hideLoading();
      if(response.success) {
        alert(response.message || 'CV Saved successfully!');
        if(response.pdfUrl) window.open(response.pdfUrl, '_blank');
        
        // Tracking fields are kept so user can keep editing
      } else {
        alert('Error: ' + response.message);
      }
    }

    function onFailure(error) {
      hideLoading();
      alert('Server Error: ' + error.message);
    }

    function showLoading(text) {
      const overlay = document.getElementById('loadingOverlay');
      const loadText = document.getElementById('loadingText');
      if (overlay) overlay.classList.remove('hidden');
      if (loadText && text) loadText.innerText = text;
    }
    
    function hideLoading() {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.classList.add('hidden');
    }

    // --- Toast Notifications helper ---
    function showNotification(message) {
      let container = document.getElementById("toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.cssText = "position:fixed;bottom:24px;left:24px;display:flex;flex-direction:column;gap:8px;z-index:999999;";
        document.body.appendChild(container);
      }
      
      const toast = document.createElement("div");
      toast.style.cssText = "padding:12px 20px;border-radius:8px;color:white;font-weight:600;font-size:0.9rem;box-shadow:0 4px 15px rgba(0,0,0,0.15);transform:translateY(20px);opacity:0;transition:all 0.3s ease;background:linear-gradient(135deg,#0284c7,#0369a1);";
      toast.innerText = message;
      container.appendChild(toast);
      
      setTimeout(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
      }, 10);
      
      setTimeout(() => {
        toast.style.transform = "translateY(-20px)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }