// /routes/licenseRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const db = require('../config/db');
const admin = require('firebase-admin');
const cloudinary = require('../config/cloudinary');
const { requireOwner } = require('../middleware/authMiddleware');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

function bufferToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(buffer).toString("base64"),
            mimeType,
        },
    };
}

// ALL routes protected by requireOwner

// POST /api/licenses - Upload and extract DL
router.post('/', requireOwner, upload.single('licenseImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY missing; proceeding without extraction');
        }
        const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
        const hasCloudinaryKeys = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
        if (!hasCloudinaryUrl && !hasCloudinaryKeys) {
            return res.status(503).json({ message: 'Image upload not configured. Set CLOUDINARY_URL or cloud_name/api_key/api_secret and restart server.' });
        }

        // driverId is required to associate the DL with a specific driver in the owner's subcollection
        const driverId = (req.body && req.body.driverId) ? String(req.body.driverId).trim() : '';
        const driverName = (req.body && req.body.driverName) ? String(req.body.driverName).trim() : '';

        if (!driverId) {
            return res.status(400).json({ message: 'driverId (driver phone number) is required.' });
        }

        const mimeType = req.file.mimetype;
        const timestamp = Date.now();
        // Use ownerId in publicId for organization
        const publicId = `cabOwners/${req.ownerId}/licenses/${driverId}-${timestamp}`;

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }).end(req.file.buffer);
        });
        const imageUrl = uploadResult.secure_url;
        const cloudinaryPublicId = uploadResult.public_id;

        let extractedJson = {};
        try {
            const imagePart = bufferToGenerativePart(req.file.buffer, mimeType);
            const prompt = "Extract the following fields from this driving license image: name, license number, date of birth (DOB), address, validity date, date of issue (DOI), blood group (BG), class of vehicle (COV), LMV validity date, MCWG validity date. The output MUST be a JSON object.";
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [imagePart, prompt],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            licenseNumber: { type: "string" },
                            dob: { type: "string", description: "Date of Birth in DD-MM-YYYY format" },
                            address: { type: "string" },
                            validity: { type: "string", description: "The expiration or valid-until date" },
                            doi: { type: "string", description: "Date of Issue" },
                            bg: { type: "string", description: "Blood Group" },
                            cov: { type: "string", description: "Class of Vehicle" },
                            lmvValidity: { type: "string", description: "LMV Validity Date" },
                            mcwgValidity: { type: "string", description: "MCWG Validity Date" },
                        },
                        required: ["name", "licenseNumber"],
                    }
                }
            });
            extractedJson = JSON.parse(response.text);
        } catch (gemErr) {
            console.warn('Gemini extraction skipped:', gemErr && gemErr.message ? gemErr.message : String(gemErr));
        }

        // Save/update under cabOwners/{ownerId}/drivers/{driverId}
        const driverRef = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(driverId);

        const updateData = {
            phone: driverId,
            dl: {
                imageUrl: imageUrl,
                cloudinaryPublicId: cloudinaryPublicId,
                extractedData: extractedJson,
                extractedAt: new Date()
            }
        };
        if (driverName || extractedJson.name) {
            updateData.name = driverName || extractedJson.name;
        }

        await driverRef.set(updateData, { merge: true });

        const doc = await driverRef.get();
        const driver = doc.data() || {};
        const savedDL = driver.dl || {};

        res.status(201).json({
            message: 'Driving License extracted and saved to driver successfully!',
            data: savedDL.extractedData,
            imageUrl: savedDL.imageUrl,
            id: doc.id
        });

    } catch (error) {
        console.error('Extraction/Saving Error:', error);
        if ((error && error.http_code === 401) || /invalid signature/i.test(String(error.message))) {
            return res.status(401).json({
                message: 'Image upload failed: invalid Cloudinary credentials. Update CLOUDINARY_URL or cloud_name/api_key/api_secret.'
            });
        }
        res.status(500).json({ message: 'Failed to extract or save data.' });
    }
});

// GET /api/licenses - List all drivers that have DL data
router.get('/', requireOwner, async (req, res) => {
    try {
        const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers');
        const snapshot = await ref.get();
        const licenses = [];
        snapshot.forEach(doc => {
            const d = doc.data();
            if (d && d.dl) {
                const finalExtractedData = { ...d.dl.extractedData };
                if (!finalExtractedData.name && d.name) {
                    finalExtractedData.name = d.name;
                }

                licenses.push({
                    id: doc.id,
                    imageUrl: d.dl.imageUrl,
                    extractedData: finalExtractedData,
                    extractedAt: d.dl.extractedAt
                });
            }
        });
        res.status(200).json(licenses);
    } catch (error) {
        console.error('Retrieval Error:', error);
        res.status(500).json({ message: 'Failed to retrieve data.' });
    }
});

// PUT /api/licenses/:id - Update DL data for a specific driver
router.put('/:id', requireOwner, async (req, res) => {
    try {
        const { id } = req.params;
        const { extractedData } = req.body;

        if (!extractedData || typeof extractedData !== 'object') {
            return res.status(400).json({ message: 'Invalid update data.' });
        }

        const driverRef = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(id);
        const snap = await driverRef.get();
        if (!snap.exists || !snap.data().dl) {
            return res.status(404).json({ message: 'Driver or DL not found' });
        }
        await driverRef.update({ 'dl.extractedData': extractedData });

        const updatedDoc = await driverRef.get();
        const d = updatedDoc.data();
        const updatedDL = d ? d.dl : null;
        res.status(200).json({ id: updatedDoc.id, imageUrl: updatedDL?.imageUrl, extractedData: updatedDL?.extractedData });

    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Failed to update license', error: error.message });
    }
});

// DELETE /api/licenses/:id - Remove DL from a driver
router.delete('/:id', requireOwner, async (req, res) => {
    try {
        const { id } = req.params;
        const driverRef = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(id);
        const driverDoc = await driverRef.get();

        if (!driverDoc.exists || !driverDoc.data().dl) {
            return res.status(404).json({ message: 'Driver or DL not found' });
        }

        const dlData = driverDoc.data().dl;

        await driverRef.update({ dl: admin.firestore.FieldValue.delete() });

        if (dlData.cloudinaryPublicId) {
            try { await cloudinary.uploader.destroy(dlData.cloudinaryPublicId); } catch (e) { }
        }

        return res.status(200).json({ message: 'DL deleted for driver' });
    } catch (error) {
        console.error('Delete Error:', error);
        return res.status(500).json({ message: 'Failed to delete DL', error: error.message });
    }
});

module.exports = router;
router.use((err, req, res, next) => {
    if (!err) return next();
    if (err && err.name === 'MulterError') {
        return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message || 'Unexpected server error' });
});

