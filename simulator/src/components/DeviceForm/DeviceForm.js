import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField } from '@mui/material';

/**
 * DeviceForm component for creating and updating IoT devices.
 *
 * @param {Function} fetchDevices - Function to fetch the list of devices.
 * @param {Object} selectedDevice - The device selected for editing.
 * @param {Function} setSelectedDevice - Function to set the selected device.
 * @param {Function} showSnackbar - Function to show a snackbar notification.
 * @returns {JSX.Element} The DeviceForm component.
 */
function DeviceForm({ fetchDevices, selectedDevice, setSelectedDevice, showSnackbar }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [sensors, setSensors] = useState({});

    /**
     * Effect hook to update the form fields when a device is selected.
     */
    useEffect(() => {
        if (selectedDevice) {
            setName(selectedDevice.name);
            setType(selectedDevice.type);
            setSensors(selectedDevice.state);
        } else {
            resetForm();
        }
    }, [selectedDevice]);

    /**
     * Creates a new device by sending a POST request to the server.
     */
    const createDevice = async () => {
        try {
            await axios.post('http://localhost:3000/devices', { name, type, state: sensors });
            fetchDevices();
            resetForm();
            showSnackbar('Device created successfully', 'success');
        } catch (error) {
            console.error('Error creating device:', error);
            showSnackbar('Error creating device', 'error');
        }
    };

    /**
     * Updates an existing device by sending a PUT request to the server.
     */
    const updateDevice = async () => {
        try {
            await axios.put(`http://localhost:3000/devices/${selectedDevice.id}`, { name, type, state: sensors });
            fetchDevices();
            resetForm();
            showSnackbar('Device updated successfully', 'success');
        } catch (error) {
            console.error('Error updating device:', error);
            showSnackbar('Error updating device', 'error');
        }
    };

    /**
     * Resets the form fields to their initial state.
     */
    const resetForm = () => {
        setName('');
        setType('');
        setSensors({});
        setSelectedDevice(null);
    };

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <TextField
                label="Device Name"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
            />
            <TextField
                label="Device Type"
                value={type}
                onChange={e => setType(e.target.value)}
                fullWidth
            />
            <TextField
                label="Sensors (JSON)"
                value={JSON.stringify(sensors, null, 2)}
                onChange={e => {
                    try {
                        setSensors(JSON.parse(e.target.value));
                    } catch (error) {
                        console.error("Invalid JSON:", error);
                        showSnackbar('Invalid JSON input', 'error');
                    }
                }}
                fullWidth
                multiline
                rows={4}
            />
            <Button variant="contained" color="primary" onClick={selectedDevice ? updateDevice : createDevice}>
                {selectedDevice ? 'Update Device' : 'Create Device'}
            </Button>
        </Box>
    );
}

export default DeviceForm;