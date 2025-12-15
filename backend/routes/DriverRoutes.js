const express = require('express');
const db = require('../config/db');
const { requireOwner } = require('../middleware/authMiddleware');

const router = express.Router();

// ALL routes in this file are now protected and owner-scoped

// GET /api/drivers - List all drivers for the logged-in owner
router.get('/', requireOwner, async (req, res) => {
    try {
        const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers');
        const snapshot = await ref.get();
        const drivers = [];
        snapshot.forEach(doc => {
            const d = doc.data() || {};
            drivers.push({
                id: doc.id,
                name: d.name || '',
                phone: d.phone || doc.id,
                dl: d.dl, // Include nested objects if needed for list view, or keep light
                aadhaar: d.aadhaar,
                rc: d.rc
            });
        });
        res.status(200).json(drivers);
    } catch (error) {
        console.error('Drivers list error:', error);
        res.status(500).json({ message: 'Failed to list drivers' });
    }
});

// POST /api/drivers - Create or Update a driver
router.post('/', requireOwner, async (req, res) => {
    try {
        const { driverId, driverName, phone, name, dob, address, bloodGroup, licenseNumber } = req.body || {};

        // Support both old (driverId/driverName) and new (phone/name) field names
        const id = (driverId || phone || '').trim();
        const dName = (driverName || name || '').trim();

        if (!id) {
            return res.status(400).json({ message: 'Driver phone number is required' });
        }

        const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(id);

        const updateData = {
            phone: id,
            updatedAt: new Date()
        };
        if (dName) updateData.name = dName;
        if (dob) updateData.dob = dob;
        if (address) updateData.address = address;
        if (bloodGroup) updateData.bloodGroup = bloodGroup;
        if (licenseNumber) updateData.licenseNumber = licenseNumber;

        // Use set with merge: true to create or update
        await ref.set(updateData, { merge: true });

        const doc = await ref.get();
        const d = doc.data() || {};

        res.status(201).json({
            id: doc.id,
            ...d
        });
    } catch (error) {
        console.error('Driver upsert error:', error);
        res.status(500).json({ message: 'Failed to save driver' });
    }
});

// DELETE /api/drivers/:id - Delete a driver
router.delete('/:id', requireOwner, async (req, res) => {
    try {
        const { id } = req.params;
        const ref = db.collection('cabOwners').doc(req.ownerId).collection('drivers').doc(id);

        // Optional: Delete subcollections or nested files (Cloudinary) if we want to be thorough
        // For now, just delete the document. The user requirement said "Remove all old global collections... keeping only cabOwners -> drivers"

        await ref.delete();
        res.status(200).json({ message: 'Driver deleted' });
    } catch (error) {
        console.error('Driver delete error:', error);
        res.status(500).json({ message: 'Failed to delete driver' });
    }
});

module.exports = router;

