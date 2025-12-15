const express = require('express');
const admin = require('firebase-admin');
const db = require('../config/db');
const router = express.Router();

// Helper to set custom claims
async function setCustomClaims(uid, claims) {
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
  } catch (e) {
    console.error('Error setting custom claims:', e);
  }
}

router.post('/owner/signup', async (req, res) => {
  try {
    const { name, businessName, email, phone, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const raw = String(phone || '').replace(/\D/g, '');
    const ten = raw.length === 10 ? raw : '';
    const payload = { email, password, displayName: name || '' };
    if (ten) payload.phoneNumber = `+91${ten}`;

    let user;
    try {
      user = await admin.auth().createUser(payload);
    } catch (e) {
      if ((e && String(e.message).toUpperCase().includes('PHONE')) || e.code === 'auth/invalid-phone-number') {
        // Fallback without phone if it fails (e.g. format issue or duplicate)
        user = await admin.auth().createUser({ email, password, displayName: name || '' });
      } else {
        throw e;
      }
    }

    // Generate readable ownerCode using a transaction counter
    let ownerCode = '';
    try {
      const counterRef = db.collection('metadata').doc('ownerCounter');
      await db.runTransaction(async (t) => {
        const snap = await t.get(counterRef);
        const last = snap.exists ? (snap.data().lastCode || 0) : 0;
        const next = Number(last) + 1;
        t.set(counterRef, { lastCode: next }, { merge: true });
        ownerCode = 'CAB-' + String(next).padStart(3, '0');
      });
    } catch (ctrErr) {
      console.warn('ownerCode generation failed, defaulting', ctrErr && ctrErr.message ? ctrErr.message : String(ctrErr));
      ownerCode = 'CAB-' + Date.now();
    }

    // Set custom claim 'owner'
    await setCustomClaims(user.uid, { role: 'owner' });

    await db.collection('cabOwners').doc(user.uid).set({
      name: name || '',
      businessName: businessName || name || '',
      email,
      phone: raw || '',
      ownerCode,
      plan: 'free', // Default plan
      createdAt: new Date()
    }, { merge: true });

    res.status(201).json({ uid: user.uid });
  } catch (e) {
    res.status(500).json({ message: e.message || 'failed to signup owner' });
  }
});

router.post('/owner/login', async (req, res) => {
  try {
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'FIREBASE_WEB_API_KEY missing' });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
    const data = await resp.json();
    if (!resp.ok) return res.status(401).json({ message: data.error?.message || 'invalid credentials' });

    // Ensure custom claim is set (idempotent)
    const userRecord = await admin.auth().getUser(data.localId);
    if (!userRecord.customClaims || userRecord.customClaims.role !== 'owner') {
      await setCustomClaims(data.localId, { role: 'owner' });
    }

    const session = await admin.auth().createSessionCookie(data.idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('session', session, { httpOnly: true, secure: isProduction, maxAge: 60 * 60 * 24 * 5 * 1000 });
    res.status(200).json({ uid: data.localId });
  } catch (e) {
    res.status(500).json({ message: e.message || 'failed to login owner' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'FIREBASE_WEB_API_KEY missing' });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
    const data = await resp.json();
    if (!resp.ok) return res.status(401).json({ message: data.error?.message || 'invalid credentials' });

    // Verify admin status via Firestore
    const adminDoc = await db.collection('admins').doc(data.localId).get();
    const byEmail = await db.collection('admins').where('email', '==', email).limit(1).get();
    const allowed = adminDoc.exists || !byEmail.empty;

    if (!allowed) return res.status(403).json({ message: 'not an admin' });

    // Set custom claim 'admin' and wait for it to propagate
    await setCustomClaims(data.localId, { role: 'admin' });

    // Wait a moment for custom claims to propagate
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get a fresh ID token with the new custom claims
    const userRecord = await admin.auth().getUser(data.localId);

    // Create session cookie with 5 days expiry
    const session = await admin.auth().createSessionCookie(data.idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('session', session, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 5 * 1000,
      sameSite: 'lax'
    });
    res.status(200).json({ uid: data.localId, role: 'admin' });
  } catch (e) {
    console.error('Admin login error:', e);
    res.status(500).json({ message: e.message || 'failed to login admin' });
  }
});

// Exchange client ID token for session cookie and enforce role access
router.post('/session', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const role = decoded.role; // From custom claims if already present in ID token

    // If role missing in token, check DB and set it
    if (!role) {
      const adminDoc = await db.collection('admins').doc(uid).get();
      const byEmail = await db.collection('admins').where('email', '==', decoded.email).limit(1).get();
      if (adminDoc.exists || !byEmail.empty) {
        await setCustomClaims(uid, { role: 'admin' });
      } else {
        const ownerDoc = await db.collection('cabOwners').doc(uid).get();
        if (ownerDoc.exists) {
          await setCustomClaims(uid, { role: 'owner' });
        } else {
          return res.status(403).json({ message: 'user not registered' });
        }
      }
    }

    const session = await admin.auth().createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('session', session, { httpOnly: true, secure: isProduction, maxAge: 60 * 60 * 24 * 5 * 1000 });
    res.status(200).json({ uid });
  } catch (e) {
    res.status(401).json({ message: e.message || 'invalid idToken' });
  }
});

// Check current authentication status
router.get('/me', async (req, res) => {
  try {
    const cookie = (req.headers && req.headers.cookie) || '';
    const parts = cookie.split(';').map(s => s.trim());
    let sessionCookie = null;
    for (const part of parts) {
      if (part.startsWith('session=')) {
        sessionCookie = decodeURIComponent(part.substring('session='.length));
        break;
      }
    }

    if (!sessionCookie) {
      return res.status(401).json({ message: 'not authenticated' });
    }

    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    const role = decoded.role || null;

    // If no role in claims, check database
    if (!role) {
      const adminDoc = await db.collection('admins').doc(decoded.uid).get();
      const byEmail = await db.collection('admins').where('email', '==', decoded.email).limit(1).get();
      if (adminDoc.exists || !byEmail.empty) {
        await setCustomClaims(decoded.uid, { role: 'admin' });
        return res.status(200).json({ uid: decoded.uid, role: 'admin', email: decoded.email });
      }

      const ownerDoc = await db.collection('cabOwners').doc(decoded.uid).get();
      if (ownerDoc.exists) {
        await setCustomClaims(decoded.uid, { role: 'owner' });
        return res.status(200).json({ uid: decoded.uid, role: 'owner', email: decoded.email });
      }

      return res.status(403).json({ message: 'user not registered' });
    }

    res.status(200).json({ uid: decoded.uid, role, email: decoded.email });
  } catch (e) {
    res.status(401).json({ message: 'invalid session' });
  }
});

router.post('/logout', (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('session', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/'
    });
    res.status(200).json({ message: 'logged out' });
  } catch (e) {
    res.status(500).json({ message: 'failed to logout' });
  }
});

module.exports = router;
