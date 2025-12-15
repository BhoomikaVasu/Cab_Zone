const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get attendance for a specific driver and month
router.get('/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }

        // Get all attendance records for the driver in the specified month
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

        const records = await Attendance.find({
            driverId,
            date: { $gte: startDate, $lte: endDate }
        });

        // Convert to object format: { "YYYY-MM-DD": "present/absent" }
        const attendanceData = {};
        records.forEach(record => {
            if (record.status) {
                attendanceData[record.date] = record.status;
            }
        });

        res.json(attendanceData);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Failed to fetch attendance data' });
    }
});

// Mark or update attendance
router.post('/', async (req, res) => {
    try {
        const { driverId, date, status } = req.body;

        if (!driverId || !date) {
            return res.status(400).json({ message: 'Driver ID and date are required' });
        }

        // If status is null, delete the record
        if (status === null) {
            await Attendance.findOneAndDelete({ driverId, date });
            return res.json({ message: 'Attendance unmarked successfully' });
        }

        // Validate status
        if (!['present', 'absent'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be "present" or "absent"' });
        }

        // Update or create attendance record
        const attendance = await Attendance.findOneAndUpdate(
            { driverId, date },
            {
                driverId,
                date,
                status,
                updatedAt: new Date()
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        res.json({
            message: 'Attendance marked successfully',
            attendance
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Failed to mark attendance' });
    }
});

// Get attendance summary for a driver
router.get('/:driverId/summary', async (req, res) => {
    try {
        const { driverId } = req.params;
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

        const records = await Attendance.find({
            driverId,
            date: { $gte: startDate, $lte: endDate }
        });

        const summary = {
            present: records.filter(r => r.status === 'present').length,
            absent: records.filter(r => r.status === 'absent').length,
            unmarked: 0 // This would need to be calculated based on total days
        };

        res.json(summary);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ message: 'Failed to fetch attendance summary' });
    }
});

module.exports = router;
