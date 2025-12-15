const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find().sort({ createdAt: -1 });
        res.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ message: 'Failed to fetch drivers' });
    }
});

// Get a specific driver
router.get('/:id', async (req, res) => {
    try {
        const driver = await Driver.findOne({ id: req.params.id });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        console.error('Error fetching driver:', error);
        res.status(500).json({ message: 'Failed to fetch driver' });
    }
});

// Create a new driver
router.post('/', async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).json(driver);
    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).json({ message: 'Failed to create driver' });
    }
});

// Update a driver
router.put('/:id', async (req, res) => {
    try {
        const driver = await Driver.findOneAndUpdate(
            { id: req.params.id },
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ message: 'Failed to update driver' });
    }
});

// Delete a driver
router.delete('/:id', async (req, res) => {
    try {
        const driver = await Driver.findOneAndDelete({ id: req.params.id });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ message: 'Failed to delete driver' });
    }
});

module.exports = router;
