const express = require('express');
const {createDevice, getAllDevices, updateDevice, deleteDevice} = require('../dbOperations');
const {broadcast} = require('../wsOperations');

const router = express.Router();

/**
 * @route POST /devices
 * @desc Create a new device
 * @access Public
 */
router.post('/devices', async (req, res) => {
    const {name, type, state} = req.body;
    try {
        const newDevice = await createDevice(name, type, state);
        broadcast(newDevice);
        res.status(201).json(newDevice);
    } catch (error) {
        console.error("Error creating device:", error);
        res.status(500).json({error: 'Failed to create device'});
    }
});

/**
 * @route GET /devices
 * @desc Get all devices
 * @access Public
 */
router.get('/devices', async (req, res) => {
    try {
        const devices = await getAllDevices();
        res.json(devices);
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.status(500).json({error: 'Failed to fetch devices'});
    }
});

/**
 * @route PUT /devices/:id
 * @desc Update a device by ID
 * @access Public
 */
router.put('/devices/:id', async (req, res) => {
    const deviceId = req.params.id;
    const {name, type, state} = req.body;
    try {
        const updatedDevice = await updateDevice(deviceId, name, type, state);
        broadcast(updatedDevice);
        res.json({message: 'Device updated'});
    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({error: 'Failed to update device'});
    }
});

/**
 * @route DELETE /devices/:id
 * @desc Delete a device by ID
 * @access Public
 */
router.delete('/devices/:id', async (req, res) => {
    const deviceId = req.params.id;
    try {
        await deleteDevice(deviceId);
        res.json({message: 'Device deleted'});
    } catch (error) {
        console.error("Error deleting device:", error);
        res.status(500).json({error: 'Failed to delete device'});
    }
});

module.exports = router;