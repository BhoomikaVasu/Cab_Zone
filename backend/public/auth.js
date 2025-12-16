document.addEventListener('DOMContentLoaded', () => {
  const adminForm = document.getElementById('adminLoginForm');
  const ownerSignupForm = document.getElementById('ownerSignupForm');
  const ownerLoginForm = document.getElementById('ownerLoginForm');

  // Admin Login Handler
  if (adminForm) adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const msg = document.getElementById('adminMessage');
    const submitBtn = adminForm.querySelector('button[type="submit"]');
    const formCard = adminForm.closest('.form-card');

    // INSTANT UI FEEDBACK - Step 1: Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('button-loading');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'AUTHENTICATING...';

    // INSTANT UI FEEDBACK - Step 2: Hide errors and dim inputs
    msg.className = 'hidden';
    msg.textContent = '';
    adminForm.classList.add('form-loading');

    // Remove shake animation if present
    formCard.classList.remove('shake');

    try {
      // OPTIMIZED FETCH - Use keepalive for faster requests
      const r1 = await fetch('/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        keepalive: true
      });
      const d1 = await r1.json();

      if (r1.ok) {
        // FAST REDIRECT - Use replace() to remove redirect flicker
        window.location.replace('/admin-dashboard.html');
        return;
      }

      // If server login failed, show the error
      throw new Error(d1.message || 'Login failed');
    } catch (err) {
      // REALTIME ERROR DISPLAY - Shake animation and professional error
      formCard.classList.add('shake');
      msg.className = 'error';
      msg.textContent = err.message || 'Login failed. Please try again.';

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.classList.remove('button-loading');
      submitBtn.textContent = originalText;
      adminForm.classList.remove('form-loading');
    }
  });

  // Owner Signup Handler
  if (ownerSignupForm) ownerSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('ownerName').value.trim();
    const email = document.getElementById('ownerEmail').value.trim();
    let phone = document.getElementById('ownerPhone').value.trim();
    phone = phone.replace(/\D/g, '').slice(0, 10);
    const password = document.getElementById('ownerPassword').value.trim();
    const msg = document.getElementById('ownerSignupMessage');

    try {
      const r = await fetch('/auth/owner/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
        keepalive: true
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'signup failed');
      msg.className = 'success';
      msg.textContent = 'Signup successful';
      window.location.replace('/owner-login.html');
    } catch (err) {
      msg.className = 'error';
      msg.textContent = err.message;
    }
  });

  // Owner Login Handler
  if (ownerLoginForm) ownerLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('ownerLoginEmail').value.trim();
    const password = document.getElementById('ownerLoginPassword').value.trim();
    const msg = document.getElementById('ownerLoginMessage');
    const submitBtn = ownerLoginForm.querySelector('button[type="submit"]');
    const formCard = ownerLoginForm.closest('.form-card');

    // INSTANT UI FEEDBACK - Step 1: Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('button-loading');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'AUTHENTICATING...';

    // INSTANT UI FEEDBACK - Step 2: Hide errors and dim inputs
    msg.className = 'hidden';
    msg.textContent = '';
    ownerLoginForm.classList.add('form-loading');

    // Remove shake animation if present
    formCard.classList.remove('shake');

    try {
      // OPTIMIZED FETCH - Use keepalive for faster requests
      const r1 = await fetch('/auth/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        keepalive: true
      });
      const d1 = await r1.json();

      if (r1.ok) {
        // FAST REDIRECT - Use replace() to remove redirect flicker
        window.location.replace('/owner-dashboard.html');
        return;
      }

      // If server login failed, show the error
      throw new Error(d1.message || 'Login failed');
    } catch (err) {
      // REALTIME ERROR DISPLAY - Shake animation and professional error
      formCard.classList.add('shake');
      msg.className = 'error';
      msg.textContent = err.message || 'Login failed. Please try again.';

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.classList.remove('button-loading');
      submitBtn.textContent = originalText;
      ownerLoginForm.classList.remove('form-loading');
    }
  });
});
