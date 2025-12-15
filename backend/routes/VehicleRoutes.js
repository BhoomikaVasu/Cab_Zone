// routes/VehicleRoutes.js
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
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only image files and PDFs are allowed!'));
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

// Helper for Cloudinary Upload
async function uploadToCloudinary(file, folderPath, publicId) {
    if (!file) return null;
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) => {
            if (err) return reject(err);
            resolve({ url: result.secure_url, publicId: result.public_id });
        }).end(file.buffer);
    });
}

// Helper for Gemini Extraction
async function extractData(modelName, file, prompt, schema) {
    if (!file) return {};
    try {
        const imagePart = bufferToGenerativePart(file.buffer, file.mimetype);
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [imagePart, prompt],
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return JSON.parse(response.text);
    } catch (e) {
        console.warn('Gemini extraction failed:', e.message);
        return {};
    }
}

// POST /api/vehicles - Create/Update Vehicle with Documents
router.post('/', requireOwner, upload.fields([
    { name: 'vehicleImage', maxCount: 1 },
    { name: 'rcImage', maxCount: 1 },
    { name: 'insuranceImage', maxCount: 1 },
    { name: 'pollutionImage', maxCount: 1 },
    { name: 'fitnessImage', maxCount: 1 },
    { name: 'permitImage', maxCount: 1 },
]), async (req, res) => {
    try {
        const vehicleId = String((req.body && req.body.vehicleId) || (req.body && req.body.numberPlate) || '').trim();
        const vehicleName = String((req.body && req.body.vehicleName) || '').trim();
        const numberPlate = String((req.body && req.body.numberPlate) || vehicleId).trim();
        const model = String((req.body && req.body.model) || '').trim();
        const vehicleType = String((req.body && req.body.vehicleType) || '').trim();
        const driverPhone = String((req.body && req.body.driverPhone) || '').trim();
        const fuelType = String((req.body && req.body.fuelType) || '').trim();
        const year = Number((req.body && req.body.year) || '') || null;
        const ownerName = String((req.body && req.body.ownerName) || (req.body && req.body.driverName) || '').trim();

        if (!vehicleId) return res.status(400).json({ message: 'vehicleId (Number Plate) is required' });

        // Files
        const rcFile = (req.files && req.files.rcImage && req.files.rcImage[0]) || null;
        const vehiclePhotoFile = (req.files && req.files.vehicleImage && req.files.vehicleImage[0]) || null;
        const insuranceFile = req.files && req.files.insuranceImage && req.files.insuranceImage[0];
        const pollutionFile = req.files && req.files.pollutionImage && req.files.pollutionImage[0];
        const fitnessFile = req.files && req.files.fitnessImage && req.files.fitnessImage[0];
        const permitFile = req.files && req.files.permitImage && req.files.permitImage[0];

        // Cloudinary Folder: cabOwners/{ownerId}/vehicles/...
        const cloudFolder = `cabOwners/${req.ownerId}/vehicles`;
        const ts = Date.now();

        // Uploads
        const rcUpload = await uploadToCloudinary(rcFile, cloudFolder, `${cloudFolder}/${vehicleId}-rc-${ts}`);
        const photoUpload = await uploadToCloudinary(vehiclePhotoFile, cloudFolder, `${cloudFolder}/${vehicleId}-photo-${ts}`);
        const insUpload = await uploadToCloudinary(insuranceFile, cloudFolder, `${cloudFolder}/${vehicleId}-insurance-${ts}`);
        const polUpload = await uploadToCloudinary(pollutionFile, cloudFolder, `${cloudFolder}/${vehicleId}-pollution-${ts}`);
        const fitUpload = await uploadToCloudinary(fitnessFile, cloudFolder, `${cloudFolder}/${vehicleId}-fitness-${ts}`);
        const perUpload = await uploadToCloudinary(permitFile, cloudFolder, `${cloudFolder}/${vehicleId}-permit-${ts}`);

        // Extractions
        const rcExtract = await extractData('gemini-2.5-flash', rcFile,
            `Extract registrationNo, registrationDate, rcValidUpto, ownerName, address, chassisNo, engineNo, model, fuelType from this Indian vehicle RC as JSON.`,
            { type: 'object', properties: { registrationNo: { type: 'string' }, registrationDate: { type: 'string' }, rcValidUpto: { type: 'string' }, ownerName: { type: 'string' }, address: { type: 'string' }, chassisNo: { type: 'string' }, engineNo: { type: 'string' }, model: { type: 'string' }, fuelType: { type: 'string' } } }
        );

        const insExtract = await extractData('gemini-2.5-flash', insuranceFile,
            `Extract policyNumber, insurer, validFrom, validUpto, vehicleNumber, ownerName from this motor insurance policy document as JSON.`,
            { type: 'object', properties: { policyNumber: { type: 'string' }, insurer: { type: 'string' }, validFrom: { type: 'string' }, validUpto: { type: 'string' }, vehicleNumber: { type: 'string' }, ownerName: { type: 'string' } } }
        );

        const polExtract = await extractData('gemini-2.5-flash', pollutionFile,
            `Extract pucNumber, testDate, validUpto, vehicleNumber from this PUC certificate as JSON.`,
            { type: 'object', properties: { pucNumber: { type: 'string' }, testDate: { type: 'string' }, validUpto: { type: 'string' }, vehicleNumber: { type: 'string' } } }
        );

        const fitExtract = await extractData('gemini-2.5-flash', fitnessFile,
            `Extract fitnessCertificateNumber, inspectionDate, validUpto, vehicleNumber from this vehicle fitness certificate as JSON.`,
            { type: 'object', properties: { fitnessCertificateNumber: { type: 'string' }, inspectionDate: { type: 'string' }, validUpto: { type: 'string' }, vehicleNumber: { type: 'string' } } }
        );

        const perExtract = await extractData('gemini-2.5-flash', permitFile,
            `Extract permitNumber, permitType, validUpto, routeOrArea, vehicleNumber from this transport permit as JSON.`,
            { type: 'object', properties: { permitNumber: { type: 'string' }, permitType: { type: 'string' }, validUpto: { type: 'string' }, routeOrArea: { type: 'string' }, vehicleNumber: { type: 'string' } } }
        );

        // Firestore Update
        const vehicleRef = db.collection('cabOwners').doc(req.ownerId).collection('vehicles').doc(vehicleId);

        const updateData = {
            carNumberPlate: numberPlate,
            updatedAt: new Date()
        };
        if (vehicleName) updateData.carName = vehicleName;
        if (model || rcExtract.model) updateData.model = model || rcExtract.model;
        if (fuelType || rcExtract.fuelType) updateData.fuelType = fuelType || rcExtract.fuelType;
        if (year) updateData.year = year;
        if (ownerName || rcExtract.ownerName) updateData.ownerName = ownerName || rcExtract.ownerName;
        if (vehicleType) updateData.vehicleType = vehicleType;
        if (driverPhone) updateData.driverPhone = driverPhone;

        // Nested documents
        const documents = {};
        if (rcUpload) documents.rc = { imageUrl: rcUpload.url, cloudinaryPublicId: rcUpload.publicId, extractedData: rcExtract, extractedAt: new Date() };
        if (insUpload) documents.insurance = { imageUrl: insUpload.url, cloudinaryPublicId: insUpload.publicId, extractedData: insExtract, extractedAt: new Date() };
        if (polUpload) documents.pollution = { imageUrl: polUpload.url, cloudinaryPublicId: polUpload.publicId, extractedData: polExtract, extractedAt: new Date() };
        if (fitUpload) documents.fitness = { imageUrl: fitUpload.url, cloudinaryPublicId: fitUpload.publicId, extractedData: fitExtract, extractedAt: new Date() };
        if (perUpload) documents.permit = { imageUrl: perUpload.url, cloudinaryPublicId: perUpload.publicId, extractedData: perExtract, extractedAt: new Date() };

        if (photoUpload) documents.photo = { imageUrl: photoUpload.url, cloudinaryPublicId: photoUpload.publicId, extractedData: {}, extractedAt: new Date() };
        if (Object.keys(documents).length > 0) {
            updateData.documents = documents;
        }

        await vehicleRef.set(updateData, { merge: true });

        const saved = (await vehicleRef.get()).data() || {};
        res.status(201).json({ id: vehicleId, ...saved });

    } catch (error) {
        console.error('Vehicle save error:', error);
        res.status(500).json({ message: 'Failed to save vehicle' });
    }
});

// GET /api/vehicles - List Owner's Vehicles
router.get('/', requireOwner, async (req, res) => {
    try {
        const ref = db.collection('cabOwners').doc(req.ownerId).collection('vehicles');
        const snap = await ref.get();
        const list = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        res.status(200).json(list);
    } catch (error) {
        console.error('List vehicles error:', error);
        res.status(500).json({ message: 'Failed to list vehicles' });
    }
});

// DELETE /api/vehicles/:id - Delete Vehicle
router.delete('/:id', requireOwner, async (req, res) => {
    try {
        const { id } = req.params;
        const ref = db.collection('cabOwners').doc(req.ownerId).collection('vehicles').doc(id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ message: 'Vehicle not found' });

        const d = doc.data();
        const docs = d.documents || {};
        const idsToDelete = [];
        if (docs.rc && docs.rc.cloudinaryPublicId) idsToDelete.push(docs.rc.cloudinaryPublicId);
        if (docs.insurance && docs.insurance.cloudinaryPublicId) idsToDelete.push(docs.insurance.cloudinaryPublicId);
        if (docs.pollution && docs.pollution.cloudinaryPublicId) idsToDelete.push(docs.pollution.cloudinaryPublicId);
        if (docs.fitness && docs.fitness.cloudinaryPublicId) idsToDelete.push(docs.fitness.cloudinaryPublicId);
        if (docs.permit && docs.permit.cloudinaryPublicId) idsToDelete.push(docs.permit.cloudinaryPublicId);

        for (const pid of idsToDelete) {
            try { await cloudinary.uploader.destroy(pid); } catch (e) { console.warn('Cloudinary delete failed:', e.message); }
        }

        await ref.delete();
        res.status(200).json({ message: 'Vehicle deleted' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ message: 'Failed to delete vehicle' });
    }
});

module.exports = router;
