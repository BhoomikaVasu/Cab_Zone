// public/app.js - updated for DL and RC
fetch('/auth/me').then(async r => { const d = await r.json(); if (!r.ok || d.role !== 'owner') { window.location.href = 'login.html'; return; } }).catch(() => { window.location.href = 'login.html'; });

// Query DOM elements
const DRIVERS_LIST_ENDPOINT = '/api/drivers';
const DRIVERS_SAVE_ENDPOINT = '/api/drivers';
const uploadForm = document.getElementById('uploadForm');
const messageElement = document.getElementById('message') || document.createElement('div');
const refreshLicenseButton = document.getElementById('refreshLicenseData');
const licenseTableBody = document.querySelector('#licenseTable tbody');
const searchLicenseInput = document.getElementById('searchLicenseInput');

// Vehicle elements
const vehicleUploadForm = document.getElementById('vehicleUploadForm');
const vehicleMessageElement = document.getElementById('vehicleMessage') || document.createElement('div');
const refreshVehicleButton = document.getElementById('refreshVehicleData');
const vehicleTableBody = document.querySelector('#vehicleTable tbody');
const searchVehicleInput = document.getElementById('searchVehicleInput');
const vehicleRegistryDropdown = document.getElementById('vehicleRegistryDropdown');
const refreshVehiclesRegistry = document.getElementById('refreshVehiclesRegistry');
const createVehicleBtn = document.getElementById('createVehicleBtn');
const vehicleNameInput = document.getElementById('vehicleNameInput');
const vehiclePlateInput = document.getElementById('vehiclePlateInput');
const vehicleModelInput = document.getElementById('vehicleModelInput');
const vehicleFuelInput = document.getElementById('vehicleFuelInput');
const vehicleYearInput = document.getElementById('vehicleYearInput');
const vehicleOwnerInput = document.getElementById('vehicleOwnerInput');
const vehicleRegistryMessage = document.getElementById('vehicleRegistryMessage');
const rcImageInput = document.getElementById('rcImage');
const insuranceImageInput = document.getElementById('insuranceImage');
const pollutionImageInput = document.getElementById('pollutionImage');
const fitnessImageInput = document.getElementById('fitnessImage');
const permitImageInput = document.getElementById('permitImage');
const vehiclesRegistryTableBody = document.querySelector('#vehiclesRegistryTable tbody');
const searchVehiclesRegistryInput = document.getElementById('searchVehiclesRegistryInput');
const refreshVehiclesRegistryTable = document.getElementById('refreshVehiclesRegistryTable');

// Aadhaar elements
const aadharUploadForm = document.getElementById('aadharUploadForm');
const aadharMessageElement = document.getElementById('aadharMessage') || document.createElement('div');
const refreshAadharButton = document.getElementById('refreshAadharData');
const aadharTableBody = document.querySelector('#aadharTable tbody');
const searchAadharInput = document.getElementById('searchAadharInput');

// Police & Contract (driver page extra tabs)
const policeUploadForm = document.getElementById('policeUploadForm');
const contractUploadForm = document.getElementById('contractUploadForm');
const policeMessageElement = document.getElementById('policeMessage') || document.createElement('div');
const contractMessageElement = document.getElementById('contractMessage') || document.createElement('div');
const policeImageInput = document.getElementById('policeImage');
const contractImageInput = document.getElementById('contractImage');
const policeFileName = document.getElementById('policeFileName');
const contractFileName = document.getElementById('contractFileName');
const policeDrop = document.getElementById('policeDrop');
const contractDrop = document.getElementById('contractDrop');

// Driver selection elements
const driverDropdown = document.getElementById('driverDropdown');
const refreshDriversBtn = document.getElementById('refreshDrivers');
const addDriverBtn = document.getElementById('addDriverBtn');
const driverNameInput = document.getElementById('driverNameInput');
const driverPhoneInput = document.getElementById('driverPhoneInput');
const driverMessage = document.getElementById('driverMessage');
const themeToggle = document.getElementById('themeToggle');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Keep last fetched data in memory for filtering
let lastLicenseData = [];
let lastVehicleData = [];
let lastAadharData = [];
let selectedDriverId = '';
let selectedDriverName = '';
let lastVehiclesRegistry = [];
let selectedVehicleId = '';

const licenseInput = document.getElementById('licenseImage');
const vehicleInput = document.getElementById('vehicleImage');
const aadharInput = document.getElementById('aadharImage');
const licenseFileName = document.getElementById('licenseFileName');
const vehicleFileName = document.getElementById('vehicleFileName');
const aadharFileName = document.getElementById('aadharFileName');
const licenseDrop = document.getElementById('licenseDrop');
const vehicleDrop = document.getElementById('vehicleDrop');
const aadharDrop = document.getElementById('aadharDrop');

// Helper: show a temporary message (type: 'success'|'error'|empty)
function showMessage(text, type, isVehicle = false, isAadhar = false) {
    let element;
    if (isAadhar) {
        element = aadharMessageElement;
    } else if (isVehicle) {
        element = vehicleMessageElement;
    } else {
        element = messageElement;
    }
    if (!element) return;
    element.textContent = text || '';
    element.className = type || '';
}

function showDriverMessage(text, type) {
    if (!driverMessage) return;
    driverMessage.textContent = text || '';
    driverMessage.className = type || '';
}

function showVehicleRegistryMessage(text, type) {
    if (!vehicleRegistryMessage) return;
    vehicleRegistryMessage.textContent = text || '';
    vehicleRegistryMessage.className = type || '';
}

function showPoliceMessage(text, type) {
    if (!policeMessageElement) return;
    policeMessageElement.textContent = text || '';
    policeMessageElement.className = type || '';
}

function showContractMessage(text, type) {
    if (!contractMessageElement) return;
    contractMessageElement.textContent = text || '';
    contractMessageElement.className = type || '';
}

async function fetchDrivers() {
    try {
        const res = await fetch(DRIVERS_LIST_ENDPOINT);
        const drivers = await res.json();
        if (Array.isArray(drivers) && driverDropdown) {
            driverDropdown.innerHTML = '<option value="">-- Select driver --</option>';
            drivers.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = `${d.name || 'Unnamed'} (${d.phone || d.id})`;
                driverDropdown.appendChild(opt);
            });
        }
    } catch (err) {
        showDriverMessage('Failed to load drivers', 'error');
    }
}

function setSelectedDriver(id, name) {
    selectedDriverId = id || '';
    selectedDriverName = name || '';
    const enabled = !!selectedDriverId;
    // Enable/disable upload forms
    uploadForm?.querySelector('button[type="submit"]').toggleAttribute('disabled', !enabled);
    vehicleUploadForm?.querySelector('button[type="submit"]').toggleAttribute('disabled', !enabled);
    aadharUploadForm?.querySelector('button[type="submit"]').toggleAttribute('disabled', !enabled);
    showDriverMessage(enabled ? `Selected driver: ${selectedDriverName || selectedDriverId}` : 'Select a driver to upload documents', enabled ? 'success' : '');
}

function setSelectedVehicle(id) {
    selectedVehicleId = id || '';
    const enabled = !!selectedVehicleId;
    vehicleUploadForm?.querySelector('button[type="submit"]').toggleAttribute('disabled', !enabled);
    showVehicleRegistryMessage(enabled ? `Selected vehicle: ${selectedVehicleId}` : 'Select or create a vehicle', enabled ? 'success' : '');
}

function setFileName(el, name) { if (el) el.textContent = name || ''; }

function setupDrop(drop, input, nameEl) {
    if (!drop || !input) return;
    input.addEventListener('change', () => setFileName(nameEl, input.files[0]?.name || ''));
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('dragover'); const f = e.dataTransfer.files; if (f && f.length) { input.files = f; setFileName(nameEl, f[0].name); } });
}

// Helper: build small initials from a full name
function getInitials(name) {
    if (!name) return 'NA';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');
}

// Modal image preview
function showImagePreview(url) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Create loading state
    modal.innerHTML = '' +
        '<div class="modal-content image-preview">' +
        '<span class="close-modal">&times;</span>' +
        '<div class="loading">Loading image...</div>' +
        '</div>';
    document.body.appendChild(modal);

    // Load image
    const img = new Image();
    img.onload = () => {
        const content = modal.querySelector('.modal-content');
        content.querySelector('.loading').remove();
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '10px';
        content.appendChild(img);
    };
    img.onerror = () => {
        modal.remove();
        showMessage('Failed to load image', 'error');
    };
    img.src = url;
    img.alt = 'Document Image';

    // Setup close handlers
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// Create action buttons for a row
function createActions(record, row, isVehicle = false, isAadhar = false) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    // View
    const viewBtn = document.createElement('button');
    viewBtn.className = 'action-icon';
    viewBtn.classList.add('view');
    viewBtn.setAttribute('aria-label', 'View Document Image');
    viewBtn.title = 'View Document Image';
    viewBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    viewBtn.addEventListener('click', async () => {
        try {
            const imageUrl = record.imageUrl;
            if (!imageUrl) { throw new Error('No Cloudinary image URL available'); }
            showMessage('Loading image...', '', isVehicle, isAadhar);
            showImagePreview(imageUrl);
            showMessage('', '', isVehicle, isAadhar);
        } catch (err) {
            showMessage('Could not load the document image. Please try uploading again.', 'error', isVehicle, isAadhar);
        }
    });

    // Open URL
    if (record.imageUrl) {
        const linkBtn = document.createElement('a');
        linkBtn.className = 'action-icon';
        linkBtn.classList.add('link');
        linkBtn.setAttribute('aria-label', 'Open Image URL');
        linkBtn.title = 'Open Image URL';
        linkBtn.href = record.imageUrl;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener noreferrer';
        linkBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path></svg>';
        actionsDiv.appendChild(linkBtn);
    }

    // Edit
    const editBtn = document.createElement('button');
    editBtn.className = 'action-icon';
    editBtn.classList.add('edit');
    editBtn.setAttribute('aria-label', 'Edit Record');
    editBtn.title = 'Edit Record';
    editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
    editBtn.addEventListener('click', () => openEditModal(record, isVehicle, isAadhar));

    // Delete
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-icon';
    deleteBtn.classList.add('delete');
    deleteBtn.setAttribute('aria-label', 'Delete Record');
    deleteBtn.title = 'Delete Record';
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
    deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            let endpoint;
            if (isAadhar) {
                endpoint = '/api/aadhar/';
            } else if (isVehicle) {
                endpoint = '/api/vehicles/';
            } else {
                endpoint = '/api/licenses/';
            }
            const res = await fetch(endpoint + record.id, { method: 'DELETE' });
            if (res.ok) {
                // row may be a table row or a card DOM element
                if (row && typeof row.remove === 'function') row.remove();
                showMessage('Record deleted successfully!', 'success', isVehicle, isAadhar);
            } else {
                throw new Error('Delete failed');
            }
        } catch (err) {
            showMessage('Failed to delete record: ' + err.message, 'error', isVehicle, isAadhar);
        }
    });

    actionsDiv.appendChild(viewBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    return actionsDiv;
}

// Open edit modal
function openEditModal(record, isVehicle = false, isAadhar = false) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    const data = record.extractedData || {};
    let title, fields;

    if (isAadhar) {
        title = 'Edit Aadhaar Details';
        fields = [
            { name: 'name', label: 'Full Name', value: data.name || '' },
            { name: 'aadhaar_no', label: 'Aadhaar Number', value: data.aadhaar_no || '' },
            { name: 'dob', label: 'Date of Birth', value: data.dob || '' },
            { name: 'gender', label: 'Gender', value: data.gender || '' },
            { name: 'address', label: 'Address', value: data.address || '' },
            { name: 'pincode', label: 'PIN Code', value: data.pincode || '' }
        ];
    } else if (isVehicle) {
        title = 'Edit Vehicle Details';
        fields = [
            { name: 'ownerName', label: 'Owner Name', value: data.ownerName || '' },
            { name: 'registrationNo', label: 'Registration No.', value: data.registrationNo || '' },
            { name: 'model', label: 'Model', value: data.model || '' },
            { name: 'fuelType', label: 'Fuel Type', value: data.fuelType || '' },
            { name: 'rcValidUpto', label: 'RC Valid Upto', value: data.rcValidUpto || '' },
            { name: 'chassisNo', label: 'Chassis No.', value: data.chassisNo || '' }
        ];
    } else {
        title = 'Edit License Details';
        fields = [
            { name: 'name', label: 'Name', value: data.name || '' },
            { name: 'phone', label: 'Phone', value: data.phone || '' },
            { name: 'licenseNumber', label: 'License Number', value: data.licenseNumber || '' },
            { name: 'dob', label: 'DOB', value: data.dob || '' },
            { name: 'validity', label: 'Expiry Date', value: data.validity || '' }
        ];
    }

    let formHTML = '<form class="edit-form">';
    fields.forEach(field => {
        formHTML += `<div class="form-group"><label>${field.label}</label><input name="${field.name}" value="${field.value}"></div>`;
    });
    formHTML += '<button type="submit" class="save-btn">Save Changes</button></form>';

    modal.innerHTML = '' +
        '<div class="modal-content">' +
        '<span class="close-modal">&times;</span>' +
        '<h3>' + title + '</h3>' +
        formHTML +
        '</div>';
    document.body.appendChild(modal);

    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    const form = modal.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Saving changes...', '', isVehicle || isAadhar);

        const fd = new FormData(form);
        const updated = Object.fromEntries(fd.entries());

        try {
            console.log('Sending update for record:', record.id, 'with data:', updated);

            let endpoint;
            if (isAadhar) {
                endpoint = '/api/aadhar/';
            } else if (isVehicle) {
                endpoint = '/api/vehicles/';
            } else {
                endpoint = '/api/licenses/';
            }

            const res = await fetch(endpoint + record.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ extractedData: updated })
            });

            const responseText = await res.text();
            console.log('Server response:', res.status, responseText);

            if (!res.ok) {
                throw new Error('Update failed: ' + responseText);
            }

            showMessage('Record updated successfully!', 'success', isVehicle, isAadhar);
            modal.remove();

            console.log('Refreshing table data...');
            if (isAadhar) {
                await fetchAndDisplayAadharData();
            } else if (isVehicle) {
                await fetchAndDisplayVehicleData();
            } else {
                await fetchAndDisplayLicenseData();
            }
            console.log('Table refresh complete');

        } catch (err) {
            console.error('Update error:', err);
            showMessage('Failed to update record: ' + err.message, 'error', isVehicle, isAadhar);
        }
    });
}

// Upload form handling for licenses
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedDriverId) { showMessage('Select a driver before uploading', 'error'); return; }
        showMessage('Processing image...', '', false);
        const submitBtn = uploadForm.querySelector('button[type="submit"]');
        submitBtn?.classList.add('loading');
        const fd = new FormData(uploadForm);
        fd.append('driverId', selectedDriverId);
        if (selectedDriverName) fd.append('driverName', selectedDriverName);
        try {
            const res = await fetch('/api/licenses', { method: 'POST', body: fd });
            const result = await res.json();
            if (res.ok) {
                showMessage('Saved: ' + (result.data?.licenseNumber || 'saved'), 'success', false);
                await fetchAndDisplayLicenseData();
            } else {
                throw new Error(result.message || 'Save failed');
            }
        } catch (err) {
            showMessage('Error: ' + err.message, 'error', false);
        } finally {
            submitBtn?.classList.remove('loading');
        }
    });
}

// Upload form handling for vehicles
if (vehicleUploadForm) {
    vehicleUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedVehicleId) { showVehicleRegistryMessage('Select a vehicle before uploading', 'error'); return; }
        showVehicleRegistryMessage('Processing documents...', '');
        const submitBtn = vehicleUploadForm.querySelector('button[type="submit"]');
        submitBtn?.classList.add('loading');
        const fd = new FormData(vehicleUploadForm);
        fd.append('vehicleId', selectedVehicleId);
        const vName = (vehicleNameInput?.value || '').trim();
        const vPlate = (vehiclePlateInput?.value || '').trim();
        const vModel = (vehicleModelInput?.value || '').trim();
        const vFuel = (vehicleFuelInput?.value || '').trim();
        const vYear = (vehicleYearInput?.value || '').trim();
        const vOwner = (vehicleOwnerInput?.value || '').trim();
        if (vName) fd.append('vehicleName', vName);
        if (vPlate) fd.append('numberPlate', vPlate);
        if (vModel) fd.append('model', vModel);
        if (vFuel) fd.append('fuelType', vFuel);
        if (vYear) fd.append('year', vYear);
        if (vOwner) fd.append('ownerName', vOwner);
        try {
            const res = await fetch('/api/vehicles', { method: 'POST', body: fd });
            const result = await res.json();
            if (res.ok) {
                showVehicleRegistryMessage('Saved', 'success');
                await fetchVehiclesRegistryList();
            } else {
                throw new Error(result.message || 'Save failed');
            }
        } catch (err) {
            showVehicleRegistryMessage('Error: ' + err.message, 'error');
        } finally {
            submitBtn?.classList.remove('loading');
        }
    });
}

// Upload form handling for Aadhaar
if (aadharUploadForm) {
    aadharUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedDriverId) { showMessage('Select a driver before uploading', 'error', false, true); return; }
        showMessage('Processing Aadhaar card...', '', false, true);
        const submitBtn = aadharUploadForm.querySelector('button[type="submit"]');
        submitBtn?.classList.add('loading');
        const fd = new FormData(aadharUploadForm);
        fd.append('driverId', selectedDriverId);
        if (selectedDriverName) fd.append('driverName', selectedDriverName);
        try {
            const res = await fetch('/api/aadhar/upload', { method: 'POST', body: fd });
            const result = await res.json();
            if (res.ok) {
                showMessage('Saved: ' + (result.data?.name || 'saved'), 'success', false, true);
                await fetchAndDisplayAadharData();
            } else {
                throw new Error(result.message || 'Save failed');
            }
        } catch (err) {
            showMessage('Error: ' + err.message, 'error', false, true);
        } finally {
            submitBtn?.classList.remove('loading');
        }
    });
}

// Placeholder handlers for Police Verification and Contract uploads
if (policeUploadForm) {
    policeUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedDriverId) { showPoliceMessage('Select a driver before uploading', 'error'); return; }
        showPoliceMessage('Uploading police verification...', '');
        const btn = policeUploadForm.querySelector('button[type="submit"]');
        btn?.classList.add('loading');
        const fd = new FormData(policeUploadForm);
        fd.append('driverId', selectedDriverId);
        if (selectedDriverName) fd.append('driverName', selectedDriverName);
        try {
            const res = await fetch('/api/drivers/police', { method: 'POST', body: fd });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Upload failed');
            showPoliceMessage('Police verification saved', 'success');
        } catch (err) {
            showPoliceMessage('Error: ' + err.message, 'error');
        } finally {
            btn?.classList.remove('loading');
        }
    });
}

if (contractUploadForm) {
    contractUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedDriverId) { showContractMessage('Select a driver before uploading', 'error'); return; }
        showContractMessage('Uploading contract...', '');
        const btn = contractUploadForm.querySelector('button[type="submit"]');
        btn?.classList.add('loading');
        const fd = new FormData(contractUploadForm);
        fd.append('driverId', selectedDriverId);
        if (selectedDriverName) fd.append('driverName', selectedDriverName);
        try {
            const res = await fetch('/api/drivers/contract', { method: 'POST', body: fd });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Upload failed');
            showContractMessage('Contract saved successfully', 'success');
        } catch (err) {
            showContractMessage('Error: ' + err.message, 'error');
        } finally {
            btn?.classList.remove('loading');
        }
    });
}

// Render license table rows
function renderLicenseTable(data) {
    if (!licenseTableBody) return;
    licenseTableBody.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        licenseTableBody.innerHTML = '<tr class="empty-state-row"><td colspan="7">No records found in the database.</td></tr>';
        return;
    }

    data.forEach(record => {
        const row = licenseTableBody.insertRow();

        // Driver cell
        const driverCell = row.insertCell();
        const d = record.extractedData || {};
        driverCell.innerHTML = '' +
            '<div class="driver-info">' +
            '<div class="avatar">' + getInitials(d.name) + '</div>' +
            '<div class="driver-details">' +
            '<span class="driver-name">' + (d.name || 'N/A') + '</span>' +
            '<span class="driver-phone">' + (d.phone || 'N/A') + '</span>' +
            '</div>' +
            '</div>';

        // License number cell
        const licenseCell = row.insertCell();
        licenseCell.textContent = d.licenseNumber || 'N/A';

        // DOB cell
        const dobCell = row.insertCell();
        dobCell.textContent = d.dob || 'N/A';

        // Expiry Date cell
        const expiryCell = row.insertCell();
        expiryCell.textContent = d.validity || 'N/A';

        // Status cell (placeholder)
        const statusCell = row.insertCell();
        statusCell.textContent = record.status || 'N/A';

        // Verification cell (placeholder)
        const verifyCell = row.insertCell();
        verifyCell.textContent = record.verified ? 'Verified' : 'Pending';

        // Actions
        const actionsCell = row.insertCell();
        actionsCell.appendChild(createActions(record, row, false));
    });
}

// Render vehicle table rows
function renderVehicleTable(data) {
    if (!vehicleTableBody) return;
    vehicleTableBody.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        vehicleTableBody.innerHTML = '<tr class="empty-state-row"><td colspan="6">No records found in the database.</td></tr>';
        return;
    }

    data.forEach(record => {
        const row = vehicleTableBody.insertRow();

        // Owner cell
        const ownerCell = row.insertCell();
        const d = record.extractedData || {};
        ownerCell.innerHTML = '' +
            '<div class="driver-info">' +
            '<div class="avatar">' + getInitials(d.ownerName) + '</div>' +
            '<div class="driver-details">' +
            '<span class="driver-name">' + (d.ownerName || 'N/A') + '</span>' +
            '</div>' +
            '</div>';

        // Registration number cell
        const regCell = row.insertCell();
        regCell.textContent = d.registrationNo || 'N/A';

        // Model cell
        const modelCell = row.insertCell();
        modelCell.textContent = d.model || 'N/A';

        // Fuel Type cell
        const fuelCell = row.insertCell();
        fuelCell.textContent = d.fuelType || 'N/A';

        // RC Valid Upto cell
        const rcValidCell = row.insertCell();
        rcValidCell.textContent = d.rcValidUpto || 'N/A';

        // Actions
        const actionsCell = row.insertCell();
        actionsCell.appendChild(createActions(record, row, true));
    });
}

// Render Aadhaar table rows
function renderAadharTable(data) {
    if (!aadharTableBody) return;
    aadharTableBody.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        aadharTableBody.innerHTML = '<tr class="empty-state-row"><td colspan="7">No records found in the database.</td></tr>';
        return;
    }

    data.forEach(record => {
        const row = aadharTableBody.insertRow();

        // Name cell
        const nameCell = row.insertCell();
        const d = record.extractedData || {};
        nameCell.innerHTML = '' +
            '<div class="driver-info">' +
            '<div class="avatar">' + getInitials(d.name) + '</div>' +
            '<div class="driver-details">' +
            '<span class="driver-name">' + (d.name || 'N/A') + '</span>' +
            '</div>' +
            '</div>';

        // Aadhaar number cell (masked)
        const aadhaarCell = row.insertCell();
        const aadhaarNo = d.aadhaar_no || '';
        const maskedAadhaar = aadhaarNo.length >= 12 ? aadhaarNo.slice(0, 4) + 'XXXX' + aadhaarNo.slice(-4) : aadhaarNo;
        aadhaarCell.textContent = maskedAadhaar || 'N/A';

        // DOB cell
        const dobCell = row.insertCell();
        dobCell.textContent = d.dob || 'N/A';

        // Gender cell
        const genderCell = row.insertCell();
        genderCell.textContent = d.gender || 'N/A';

        // Address cell
        const addressCell = row.insertCell();
        addressCell.textContent = d.address || 'N/A';

        // PIN Code cell
        const pincodeCell = row.insertCell();
        pincodeCell.textContent = d.pincode || 'N/A';

        // Actions
        const actionsCell = row.insertCell();
        actionsCell.appendChild(createActions(record, row, false, true));
    });
}

// Fetch and render license data
async function fetchAndDisplayLicenseData() {
    try {
        const res = await fetch('/api/licenses');
        const data = await res.json();
        lastLicenseData = Array.isArray(data) ? data : [];

        // Apply search filter if present
        const q = (searchLicenseInput?.value || '').trim().toLowerCase();
        const filtered = q ? lastLicenseData.filter(rec => {
            const d = rec.extractedData || {};
            return (d.name || '').toLowerCase().includes(q) || (d.licenseNumber || '').toLowerCase().includes(q) || (d.dob || '').toLowerCase().includes(q) || (d.validity || '').toLowerCase().includes(q);
        }) : lastLicenseData;

        renderLicenseTable(filtered);
    } catch (err) {
        console.error('fetch license error', err);
        showMessage('Could not retrieve license records. Please try again.', 'error', false);
    }
}

// Fetch and render vehicle data
async function fetchAndDisplayVehicleData() {
    try {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        lastVehicleData = Array.isArray(data) ? data : [];

        // Apply search filter if present
        const q = (searchVehicleInput?.value || '').trim().toLowerCase();
        const filtered = q ? lastVehicleData.filter(rec => {
            const d = rec.extractedData || {};
            return (d.ownerName || '').toLowerCase().includes(q) || (d.registrationNo || '').toLowerCase().includes(q) || (d.model || '').toLowerCase().includes(q) || (d.fuelType || '').toLowerCase().includes(q) || (d.rcValidUpto || '').toLowerCase().includes(q);
        }) : lastVehicleData;

        renderVehicleTable(filtered);
    } catch (err) {
        console.error('fetch vehicle error', err);
        showMessage('Could not retrieve vehicle records. Please try again.', 'error', true);
    }
}

async function fetchVehiclesRegistryList() {
    try {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        lastVehiclesRegistry = Array.isArray(data) ? data : [];
        const q = (searchVehiclesRegistryInput?.value || '').trim().toLowerCase();
        const filtered = q ? lastVehiclesRegistry.filter(rec => {
            return (rec.carName || '').toLowerCase().includes(q) || (rec.carNumberPlate || '').toLowerCase().includes(q) || (rec.model || '').toLowerCase().includes(q) || (rec.fuelType || '').toLowerCase().includes(q) || String(rec.year || '').includes(q);
        }) : lastVehiclesRegistry;
        renderVehiclesRegistryTable(filtered);
        if (vehicleRegistryDropdown) {
            vehicleRegistryDropdown.innerHTML = '<option value="">-- Select vehicle --</option>';
            filtered.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                opt.textContent = `${v.carName || 'Unnamed'} (${v.carNumberPlate || v.id})`;
                vehicleRegistryDropdown.appendChild(opt);
            });
        }
    } catch (err) {
        showVehicleRegistryMessage('Could not retrieve vehicles', 'error');
    }
}

function renderVehiclesRegistryTable(data) {
    if (!vehiclesRegistryTableBody) return;
    vehiclesRegistryTableBody.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        vehiclesRegistryTableBody.innerHTML = '<tr class="empty-state-row"><td colspan="10">No vehicles found.</td></tr>';
        return;
    }
    data.forEach(rec => {
        const row = vehiclesRegistryTableBody.insertRow();
        const carCell = row.insertCell();
        carCell.textContent = rec.carName || '';
        const plateCell = row.insertCell();
        plateCell.textContent = rec.carNumberPlate || '';
        const modelCell = row.insertCell();
        modelCell.textContent = rec.model || '';
        const fuelCell = row.insertCell();
        fuelCell.textContent = rec.fuelType || '';
        const yearCell = row.insertCell();
        yearCell.textContent = rec.year || '';
        function addLink(cell, obj) {
            cell.innerHTML = '';
            const url = obj && obj.imageUrl;
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = 'View';
                cell.appendChild(a);
            } else {
                cell.textContent = '-';
            }
        }
        addLink(row.insertCell(), rec.rc);
        addLink(row.insertCell(), rec.insurance);
        addLink(row.insertCell(), rec.pollution);
        addLink(row.insertCell(), rec.fitness);
        addLink(row.insertCell(), rec.permit);
    });
}

// Fetch and render Aadhaar data
async function fetchAndDisplayAadharData() {
    try {
        const res = await fetch('/api/aadhar');
        const data = await res.json();
        lastAadharData = Array.isArray(data) ? data : [];

        // Apply search filter if present
        const q = (searchAadharInput?.value || '').trim().toLowerCase();
        const filtered = q ? lastAadharData.filter(rec => {
            const d = rec.extractedData || {};
            return (d.name || '').toLowerCase().includes(q) || (d.aadhaar_no || '').toLowerCase().includes(q) || (d.dob || '').toLowerCase().includes(q) || (d.address || '').toLowerCase().includes(q);
        }) : lastAadharData;

        renderAadharTable(filtered);
    } catch (err) {
        console.error('fetch Aadhaar error', err);
        showMessage('Could not retrieve Aadhaar records. Please try again.', 'error', false, true);
    }
}

// Wire refresh buttons
if (refreshLicenseButton) refreshLicenseButton.addEventListener('click', fetchAndDisplayLicenseData);
if (refreshVehicleButton) refreshVehicleButton.addEventListener('click', fetchAndDisplayVehicleData);
if (refreshVehiclesRegistry) refreshVehiclesRegistry.addEventListener('click', fetchVehiclesRegistryList);
if (refreshVehiclesRegistryTable) refreshVehiclesRegistryTable.addEventListener('click', fetchVehiclesRegistryList);
if (refreshAadharButton) refreshAadharButton.addEventListener('click', fetchAndDisplayAadharData);

// Search inputs
if (searchLicenseInput) {
    searchLicenseInput.addEventListener('input', () => {
        const q = (searchLicenseInput.value || '').trim().toLowerCase();
        const filtered = q ? lastLicenseData.filter(rec => {
            const d = rec.extractedData || {};
            return (d.name || '').toLowerCase().includes(q) || (d.licenseNumber || '').toLowerCase().includes(q) || (d.dob || '').toLowerCase().includes(q) || (d.validity || '').toLowerCase().includes(q);
        }) : lastLicenseData;
        renderLicenseTable(filtered);
    });
}

if (searchVehicleInput) {
    searchVehicleInput.addEventListener('input', () => {
        const q = (searchVehicleInput.value || '').trim().toLowerCase();
        const filtered = q ? lastVehicleData.filter(rec => {
            const d = rec.extractedData || {};
            return (d.ownerName || '').toLowerCase().includes(q) || (d.registrationNo || '').toLowerCase().includes(q) || (d.model || '').toLowerCase().includes(q) || (d.fuelType || '').toLowerCase().includes(q) || (d.rcValidUpto || '').toLowerCase().includes(q);
        }) : lastVehicleData;
        renderVehicleTable(filtered);
    });
}

if (searchVehiclesRegistryInput) {
    searchVehiclesRegistryInput.addEventListener('input', () => {
        const q = (searchVehiclesRegistryInput.value || '').trim().toLowerCase();
        const filtered = q ? lastVehiclesRegistry.filter(rec => {
            return (rec.carName || '').toLowerCase().includes(q) || (rec.carNumberPlate || '').toLowerCase().includes(q) || (rec.model || '').toLowerCase().includes(q) || (rec.fuelType || '').toLowerCase().includes(q) || String(rec.year || '').includes(q);
        }) : lastVehiclesRegistry;
        renderVehiclesRegistryTable(filtered);
    });
}

// Aadhaar search input
if (searchAadharInput) {
    searchAadharInput.addEventListener('input', () => {
        const q = (searchAadharInput.value || '').trim().toLowerCase();
        const filtered = q ? lastAadharData.filter(rec => {
            const d = rec.extractedData || {};
            return (d.name || '').toLowerCase().includes(q) || (d.aadhaar_no || '').toLowerCase().includes(q) || (d.dob || '').toLowerCase().includes(q) || (d.address || '').toLowerCase().includes(q);
        }) : lastAadharData;
        renderAadharTable(filtered);
    });
}

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId + '-tab').classList.add('active');
    });
});

// Initial load
fetchAndDisplayLicenseData();
fetchAndDisplayAadharData();
fetchVehiclesRegistryList();

// Driver selection wiring
if (refreshDriversBtn) refreshDriversBtn.addEventListener('click', fetchDrivers);
if (driverDropdown) {
    driverDropdown.addEventListener('change', () => {
        const id = driverDropdown.value;
        const text = driverDropdown.options[driverDropdown.selectedIndex]?.text || '';
        const name = text.split('(')[0].trim();
        setSelectedDriver(id, name);
    });
}
if (vehicleRegistryDropdown) {
    vehicleRegistryDropdown.addEventListener('change', () => {
        const id = vehicleRegistryDropdown.value;
        setSelectedVehicle(id);
    });
}
if (addDriverBtn) {
    addDriverBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const name = (driverNameInput?.value || '').trim();
        let id = (driverPhoneInput?.value || '').trim();
        id = id.replace(/\D/g, '').slice(0, 10);
        if (!id) { showDriverMessage('Enter driver phone number', 'error'); return; }
        try {
            const res = await fetch(DRIVERS_SAVE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driverId: id, driverName: name })
            });
            if (!res.ok) throw new Error('Failed to save driver');
            await fetchDrivers();
            // Select saved driver
            driverDropdown.value = id;
            setSelectedDriver(id, name);
            showDriverMessage('Driver saved and selected', 'success');
        } catch (err) {
            showDriverMessage('Failed to save driver', 'error');
        }
    });
}

if (createVehicleBtn) {
    createVehicleBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const name = (vehicleNameInput?.value || '').trim();
        const plate = (vehiclePlateInput?.value || '').trim();
        const model = (vehicleModelInput?.value || '').trim();
        const fuel = (vehicleFuelInput?.value || '').trim();
        const year = (vehicleYearInput?.value || '').trim();
        const owner = (vehicleOwnerInput?.value || '').trim();
        if (!plate) { showVehicleRegistryMessage('Enter number plate', 'error'); return; }
        const fd = new FormData();
        fd.append('vehicleId', plate);
        if (name) fd.append('vehicleName', name);
        if (plate) fd.append('numberPlate', plate);
        if (model) fd.append('model', model);
        if (fuel) fd.append('fuelType', fuel);
        if (year) fd.append('year', year);
        if (owner) fd.append('ownerName', owner);
        try {
            const res = await fetch('/api/vehicles', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Failed to save vehicle');
            await fetchVehiclesRegistryList();
            setSelectedVehicle(plate);
            if (vehicleRegistryDropdown) vehicleRegistryDropdown.value = plate;
            showVehicleRegistryMessage('Vehicle saved and selected', 'success');
        } catch (err) {
            showVehicleRegistryMessage('Failed to save vehicle', 'error');
        }
    });
}

fetchDrivers();
fetchVehiclesRegistryList();
setupDrop(licenseDrop, licenseInput, licenseFileName);
setupDrop(vehicleDrop, vehicleInput, vehicleFileName);
setupDrop(aadharDrop, aadharInput, aadharFileName);
setupDrop(policeDrop, policeImageInput, policeFileName);
setupDrop(contractDrop, contractImageInput, contractFileName);

// Theme Toggle Functionality
function applyTheme(t) {
    document.body.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    // Update theme toggle icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (t === 'dark') {
            // Moon icon for dark mode
            themeIcon.innerHTML = '\u003cpath fill="currentColor" d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/\u003e';
        } else {
            // Sun icon for light mode
            themeIcon.innerHTML = '\u003cpath fill="currentColor" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/\u003e';
        }
    }
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
}

// Logout Button Functionality
const logoutButton = document.getElementById('logoutBtn');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
            // Clear any local storage if needed
            localStorage.removeItem('theme'); // Optional: keep theme preference
            // Redirect to login page
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Redirect anyway on error
            window.location.href = '/login.html';
        }
    });
}

// Scope detection: use owner-scoped endpoints on owner dashboard
