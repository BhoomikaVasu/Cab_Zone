const express = require('express');
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/owners', requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection('cabOwners').get();
    const items = [];
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      const drivers = await db.collection('cabOwners').doc(doc.id).collection('drivers').get();
      const vehicles = await db.collection('cabOwners').doc(doc.id).collection('vehicles').get();
      items.push({
        ownerId: doc.id,
        ownerCode: d.ownerCode || '',
        businessName: d.businessName || d.name || '',
        email: d.email || '',
        phone: d.phone || '',
        driverCount: drivers.size,
        vehicleCount: vehicles.size
      });
    }
    items.sort((a, b) => String(a.ownerCode || '').localeCompare(String(b.ownerCode || '')));
    res.status(200).json(items);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to list owners' });
  }
});

router.get('/owners/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const ref = db.collection('cabOwners').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Owner not found' });
    const owner = doc.data();
    const drivers = await ref.collection('drivers').get();
    const vehicles = await ref.collection('vehicles').get();
    const dList = drivers.docs.map(d => ({ id: d.id, ...d.data() }));
    const vList = vehicles.docs.map(d => ({ id: d.id, ...d.data() }));
    res.status(200).json({ id, owner, drivers: dList, vehicles: vList });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to get owner' });
  }
});

// System metrics endpoint
router.get('/metrics/system', requireAdmin, async (req, res) => {
  try {
    const ownersSnap = await db.collection('cabOwners').get();
    let totalDrivers = 0;
    let totalVehicles = 0;
    let totalDocuments = 0;
    let todaysUploads = 0;

    // Get today's timestamp
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    // Count drivers, vehicles, and documents across all owners
    for (const ownerDoc of ownersSnap.docs) {
      const ownerId = ownerDoc.id;

      // Count drivers
      const driversSnap = await db.collection('cabOwners').doc(ownerId).collection('drivers').get();
      totalDrivers += driversSnap.size;

      // Count documents within drivers (dl, aadhaar, etc.)
      driversSnap.forEach(driverDoc => {
        const driverData = driverDoc.data();
        if (driverData.dl) {
          totalDocuments++;
          // Check if uploaded today
          if (driverData.dl.extractedAt && driverData.dl.extractedAt.toMillis) {
            if (driverData.dl.extractedAt.toMillis() >= todayTimestamp) {
              todaysUploads++;
            }
          }
        }
        if (driverData.aadhaar) {
          totalDocuments++;
          if (driverData.aadhaar.extractedAt && driverData.aadhaar.extractedAt.toMillis) {
            if (driverData.aadhaar.extractedAt.toMillis() >= todayTimestamp) {
              todaysUploads++;
            }
          }
        }
        if (driverData.policeVerification) totalDocuments++;
        if (driverData.contract) totalDocuments++;
      });

      // Count vehicles
      const vehiclesSnap = await db.collection('cabOwners').doc(ownerId).collection('vehicles').get();
      totalVehicles += vehiclesSnap.size;
    }

    res.status(200).json({
      totalOwners: ownersSnap.size,
      totalDrivers,
      totalVehicles,
      totalDocumentsUploaded: totalDocuments,
      todaysUploads,
      ocrSuccessRate: 0 // Placeholder - implement OCR tracking if needed
    });
  } catch (e) {
    console.error('Metrics error:', e);
    res.status(500).json({ message: e.message || 'Failed to get metrics' });
  }
});

module.exports = router;
