import React from 'react';
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import axios from 'axios';

/**
 * DeviceList component for displaying a list of IoT devices.
 *
 * @param {Array} devices - Array of device objects to display.
 * @param {Function} setSelectedDevice - Function to set the selected device for editing.
 * @param {Function} fetchDevices - Function to fetch the list of devices.
 * @param {Function} showSnackbar - Function to show a snackbar notification.
 * @returns {JSX.Element} The DeviceList component.
 */
function DeviceList({devices, setSelectedDevice, fetchDevices, showSnackbar}) {
    /**
     * Deletes a device by sending a DELETE request to the server.
     *
     * @param {string} id - The ID of the device to delete.
     */
    const deleteDevice = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/devices/${id}`);
            fetchDevices();
            showSnackbar('Device deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting device:', error);
            showSnackbar('Error deleting device', 'error');
        }
    };

    return (
        <List>
            {devices.map(device => (
                <ListItem key={device.id} divider>
                    <ListItemText
                        primary={device.name}
                        secondary={`${device.type} - ${JSON.stringify(device.state)}`}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => setSelectedDevice(device)}>
                            <Edit/>
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteDevice(device.id)}>
                            <Delete/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

export default DeviceList;