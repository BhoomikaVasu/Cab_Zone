const express = require('express');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { requireOwner } = require('../middleware/authMiddleware');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only image files and PDFs are allowed!'));
  },
});

function bufferToGenerativePart(buffer, mimeType) {
  return { inlineData: { data: Buffer.from(buffer).toString('base64'), mimeType } };
}

// POST /api/drivers/photo - Upload driver portrait photo
router.post('/photo', requireOwner, upload.single('photoImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No photo uploaded.' });
    const driverId = (req.body && req.body.driverId) ? String(req.body.driverId).trim() : '';
    const driverName = (req.body && req.body.driverName) ? String(req.body.driverName).trim() : '';
    if (!driverId) return res.status(400).json({ message: 'driverId is required' });

    const publicId = `cabOwners/${req.ownerId}/drivers/${driverId}-photo-${Date.now()}`;
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }).end(req.file.buffer);
    });

    const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(driverId);
    const data = { phone: driverId, photo: { imageUrl: uploadResult.secure_url, cloudinaryPublicId: uploadResult.public_id, uploadedAt: new Date() } };
    if (driverName) data.name = driverName;
    await ref.set(data, { merge: true });
    const snap = await ref.get();
    const d = snap.data() || {};
    res.status(201).json({ id: snap.id, photo: d.photo });
  } catch (error) {
    console.error('Driver photo upload error:', error);
    res.status(500).json({ message: 'Failed to upload driver photo' });
  }
});

// POST /api/drivers/police - Upload Police Verification (with basic extraction)
router.post('/police', requireOwner, upload.single('policeImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No police document uploaded.' });
    const driverId = (req.body && req.body.driverId) ? String(req.body.driverId).trim() : '';
    const driverName = (req.body && req.body.driverName) ? String(req.body.driverName).trim() : '';
    if (!driverId) return res.status(400).json({ message: 'driverId is required' });

    const publicId = `cabOwners/${req.ownerId}/police/${driverId}-${Date.now()}`;
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }).end(req.file.buffer);
    });

    let extracted = {};
    try {
      const part = bufferToGenerativePart(req.file.buffer, req.file.mimetype);
      const prompt = `Extract police verification details as JSON with keys: certificateNumber, applicantName, issueDate, validUpto, remarks.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [part, prompt], config: { responseMimeType: 'application/json', responseSchema: { type: 'object', properties: { certificateNumber: { type: 'string' }, applicantName: { type: 'string' }, issueDate: { type: 'string' }, validUpto: { type: 'string' }, remarks: { type: 'string' } } } } });
      extracted = JSON.parse(response.text);
    } catch (e) {
      console.warn('Police extraction skipped:', e && e.message ? e.message : String(e));
    }

    const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(driverId);
    const data = { phone: driverId, police: { imageUrl: uploadResult.secure_url, cloudinaryPublicId: uploadResult.public_id, extractedData: extracted, extractedAt: new Date() } };
    if (driverName || extracted.applicantName) data.name = driverName || extracted.applicantName;
    await ref.set(data, { merge: true });
    const snap = await ref.get();
    const d = snap.data() || {};
    res.status(201).json({ id: snap.id, police: d.police });
  } catch (error) {
    console.error('Police upload error:', error);
    res.status(500).json({ message: 'Failed to upload police verification' });
  }
});

// POST /api/drivers/contract - Upload Driver Contract
router.post('/contract', requireOwner, upload.single('contractImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No contract document uploaded.' });
    const driverId = (req.body && req.body.driverId) ? String(req.body.driverId).trim() : '';
    const driverName = (req.body && req.body.driverName) ? String(req.body.driverName).trim() : '';
    if (!driverId) return res.status(400).json({ message: 'driverId is required' });

    const publicId = `cabOwners/${req.ownerId}/contract/${driverId}-${Date.now()}`;
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }).end(req.file.buffer);
    });

    let extracted = {};
    try {
      const part = bufferToGenerativePart(req.file.buffer, req.file.mimetype);
      // Contract usually doesn't need field extraction, but we can try to get dates/names if useful
      // For now, keep it simple or extract valid dates
      const prompt = `Extract contract key details: contractStartDate, contractEndDate, partyNames. Return JSON.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [part, prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              contractStartDate: { type: 'string' },
              contractEndDate: { type: 'string' },
              partyNames: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      });
      extracted = JSON.parse(response.text);
    } catch (e) {
      console.warn('Contract extraction skipped:', e && e.message ? e.message : String(e));
    }

    const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(driverId);
    const data = {
      phone: driverId,
      contract: {
        imageUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        extractedData: extracted,
        uploadedAt: new Date()
      }
    };
    if (driverName) data.name = driverName;
    await ref.set(data, { merge: true });

    const snap = await ref.get();
    const d = snap.data() || {};
    res.status(201).json({ id: snap.id, contract: d.contract });
  } catch (error) {
    console.error('Contract upload error:', error);
    res.status(500).json({ message: 'Failed to upload contract' });
  }
});

module.exports = router;
