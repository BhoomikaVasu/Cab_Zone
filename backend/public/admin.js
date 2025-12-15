document.addEventListener('DOMContentLoaded', () => {
  // Authentication is handled in the HTML file
  const ownersTableBody = document.querySelector('#ownersTable tbody');
  const overviewTableBody = document.getElementById('overviewTableBody');
  const refreshOwners = document.getElementById('refreshOwners');
  const searchOwnersInput = document.getElementById('searchOwnersInput');

  async function loadOwners() {
    try {
      // OPTIMIZATION: Use keepalive for faster requests
      const r = await fetch('/api/admin/owners', { keepalive: true });
      const list = await r.json();
      const data = Array.isArray(list) ? list : [];
      const q = (searchOwnersInput?.value || '').trim().toLowerCase();
      const filtered = q ? data.filter(o => (o.businessName || '').toLowerCase().includes(q) || (o.email || '').toLowerCase().includes(q)) : data;
      ownersTableBody.innerHTML = '';

      // OPTIMIZATION: Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      filtered.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.ownerCode || '-'}</td><td>${o.businessName || '-'}</td><td>${o.email || '-'}</td><td>${o.phone || '-'}</td><td>${o.driverCount || 0}</td><td>${o.vehicleCount || 0}</td><td>${o.documentCount || 0}</td><td>${formatDate(o.createdAt)}</td><td><a class="button-secondary" href="#" data-id="${o.ownerId}">View</a></td>`;
        fragment.appendChild(tr);
      });
      ownersTableBody.appendChild(fragment);

      populateAnalyticsOwnerSelect(data);
    } catch (e) {
      console.error('Failed to load owners:', e);
      ownersTableBody.innerHTML = '<tr><td colspan="9">Failed to load owners</td></tr>';
    }
  }

  if (refreshOwners) refreshOwners.addEventListener('click', loadOwners);
  if (searchOwnersInput) searchOwnersInput.addEventListener('input', loadOwners);
  loadOwners();

  const ownersTab = document.getElementById('owners-tab');
  let detailsContainer = null;
  function ensureDetailsContainer() {
    if (!detailsContainer) {
      detailsContainer = document.createElement('div');
      detailsContainer.id = 'ownerDetails';
      detailsContainer.className = 'system-card';
      detailsContainer.innerHTML = '<h3>Owner Details</h3><div id="ownerDetailsBody">Select an owner to view details.</div>';
      ownersTab.appendChild(detailsContainer);
    }
  }

  ownersTableBody.addEventListener('click', async (e) => {
    const a = e.target.closest('a[data-id]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('data-id');
    ensureDetailsContainer();
    const body = document.getElementById('ownerDetailsBody');
    body.textContent = 'Loading...';
    try {
      const r = await fetch(`/api/admin/owners/${id}`);
      const d = await r.json();
      if (!r.ok) { body.textContent = d.message || 'Failed to load'; return; }
      const owner = d.owner || {};
      const drivers = Array.isArray(d.drivers) ? d.drivers : [];
      const vehicles = Array.isArray(d.vehicles) ? d.vehicles : [];
      body.innerHTML = '' +
        `<div class="table-container"><div class="list-controls"><div class="search-input" style="max-width:280px">${owner.name || '-'} (${owner.email || '-'})</div></div>` +
        `<div class="table-wrap"><table class="data-table"><thead><tr><th>Driver</th><th>Phone</th></tr></thead><tbody>${drivers.map(x => `<tr><td>${(x.name || '-')}</td><td>${(x.phone || '-')}</td></tr>`).join('') || '<tr><td colspan="2">No drivers</td></tr>'}</tbody></table></div></div>` +
        `<div class="table-container"><div class="table-wrap"><table class="data-table"><thead><tr><th>Vehicle</th><th>Plate</th><th>Model</th><th>Fuel</th></tr></thead><tbody>${vehicles.map(v => `<tr><td>${(v.carName || '-')}</td><td>${(v.carNumberPlate || '-')}</td><td>${(v.model || '-')}</td><td>${(v.fuelType || '-')}</td></tr>`).join('') || '<tr><td colspan="4">No vehicles</td></tr>'}</tbody></table></div></div>`;
    } catch (err) {
      body.textContent = 'Failed to load details';
    }
  });

  const tabLinks = document.querySelectorAll('[data-tab-link]');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  function activateTab(id) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tab') === id));
    tabContents.forEach(el => el.classList.toggle('active', el.id === id + '-tab'));

    // Also update sidebar/nav links
    document.querySelectorAll('[data-tab-link]').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab-link') === id);
    });
  }
  tabLinks.forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); const id = a.getAttribute('data-tab-link'); activateTab(id); }));

  async function loadSystemMetrics() {
    try {
      // OPTIMIZATION: Show loading state immediately for better UX
      const so = document.getElementById('statOwners');
      const sd = document.getElementById('statDrivers');
      const sv = document.getElementById('statVehicles');
      const sdoc = document.getElementById('statDocuments');
      const stoday = document.getElementById('statToday');
      const socr = document.getElementById('statOcr');

      // Show loading animation
      [so, sd, sv, sdoc, stoday, socr].forEach(el => {
        if (el) el.innerHTML = '<span class="loading-shimmer">...</span>';
      });

      // OPTIMIZATION: Fetch data with keepalive for faster requests
      const r = await fetch('/api/admin/metrics/system', { keepalive: true });
      const m = await r.json();

      // OPTIMIZATION: Update UI immediately as data arrives (no waiting)
      const body = overviewTableBody;
      if (body) {
        body.innerHTML = '';
        const rows = [
          ['Total Cab Owners', m.totalOwners || 0],
          ['Total Drivers', m.totalDrivers || 0],
          ['Total Vehicles', m.totalVehicles || 0],
          ['Total Documents Uploaded', m.totalDocumentsUploaded || 0],
          ["Today's Uploads", m.todaysUploads || 0],
          ['OCR Success Rate', (m.ocrSuccessRate || 0) + '%']
        ];
        rows.forEach(([k, v]) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
          body.appendChild(tr);
        });
      }

      // Update stat cards with animation
      if (so) animateCount(so, m.totalOwners || 0);
      if (sd) animateCount(sd, m.totalDrivers || 0);
      if (sv) animateCount(sv, m.totalVehicles || 0);
      if (sdoc) animateCount(sdoc, m.totalDocumentsUploaded || 0);
      if (stoday) animateCount(stoday, m.todaysUploads || 0);
      if (socr) socr.textContent = (m.ocrSuccessRate || 0) + '%';
    } catch (e) {
      console.error('Failed to load metrics:', e);
    }
  }

  // OPTIMIZATION: Animate numbers counting up for better UX
  function animateCount(el, target) {
    const duration = 800; // 0.8 seconds
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  function formatDate(x) {
    try {
      if (!x) return '-';
      if (x.seconds && x.nanoseconds) {
        const d = new Date(x.seconds * 1000);
        return d.toISOString().slice(0, 10);
      }
      const d = new Date(x);
      if (isNaN(d.getTime())) return '-';
      return d.toISOString().slice(0, 10);
    } catch { return '-'; }
  }

  function formatBytes(n) {
    const u = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0, v = Number(n) || 0;
    while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
    return v.toFixed(1) + ' ' + u[i];
  }

  function populateAnalyticsOwnerSelect(list) {
    const sel = document.getElementById('analyticsOwnerSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select owner...</option>' + (list.map(o => `<option value="${o.ownerId}">${o.ownerCode || ''} ${o.businessName || ''}</option>`).join(''));
  }

  async function loadOwnerAnalytics() {
    const sel = document.getElementById('analyticsOwnerSelect');
    if (!sel) return;
    const id = sel.value.trim();
    if (!id) return;
    const byTypeBody = document.getElementById('analyticsByType');
    const timelineBody = document.getElementById('analyticsTimeline');
    const storageEl = document.getElementById('analyticsStorage');
    const ocrEl = document.getElementById('analyticsOcr');
    if (byTypeBody) byTypeBody.innerHTML = '';
    if (timelineBody) timelineBody.innerHTML = '';
    try {
      const r = await fetch(`/api/admin/owners/${id}/analytics`);
      const d = await r.json();
      if (!r.ok) return;
      const bt = d.byType || {};
      Object.keys(bt).forEach(k => { const tr = document.createElement('tr'); tr.innerHTML = `<td>${k}</td><td>${bt[k]}</td>`; byTypeBody.appendChild(tr); });
      const tl = Array.isArray(d.timeline) ? d.timeline : [];
      tl.forEach(it => { const tr = document.createElement('tr'); tr.innerHTML = `<td>${it.date}</td><td>${it.count}</td>`; timelineBody.appendChild(tr); });
      if (storageEl) storageEl.textContent = formatBytes(d.storageBytes || 0);
      if (ocrEl) ocrEl.textContent = ((d.ocrSuccessRate || 0) + '%');
    } catch (e) { }
  }

  const refreshAnalytics = document.getElementById('refreshAnalytics');
  if (refreshAnalytics) refreshAnalytics.addEventListener('click', loadOwnerAnalytics);
  const analyticsOwnerSelect = document.getElementById('analyticsOwnerSelect');
  if (analyticsOwnerSelect) analyticsOwnerSelect.addEventListener('change', loadOwnerAnalytics);

  loadSystemMetrics();

  // Theme Toggle Functionality
  function applyTheme(t) {
    document.body.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
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
        window.location.href = '/admin-login.html';
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/admin-login.html';
      }
    });
  }
});
