import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Container, Typography} from '@mui/material';
import DeviceForm from './components/DeviceForm/DeviceForm';
import DeviceList from './components/DeviceList/DeviceList';
import SnackbarNotification from './components/SnackbarNotification/SnackbarNotification';

/**
 * The main component of the Device Simulator application.
 * Manages the state of devices, selected device, and snackbar notifications.
 *
 * @component
 */
function App() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    /**
     * Fetches the list of devices when the component mounts.
     */
    useEffect(() => {
        fetchDevices();
    }, []);

    /**
     * Fetches the list of devices from the server.
     */
    const fetchDevices = async () => {
        try {
            const {data} = await axios.get('http://localhost:3000/devices');
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            showSnackbar('Error fetching devices', 'error');
        }
    };

    /**
     * Displays a snackbar notification with the given message and severity.
     *
     * @param {string} message - The message to display.
     * @param {string} severity - The severity level of the notification ('error', 'warning', 'info', 'success').
     */
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    /**
     * Handles the closing of the snackbar notification.
     *
     * @param {Object} event - The event object.
     * @param {string} reason - The reason for closing the snackbar.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                Device Simulator
            </Typography>
            <DeviceForm
                fetchDevices={fetchDevices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
                showSnackbar={showSnackbar}
            />
            <Typography variant="h4" component="h2" gutterBottom>
                Device List
            </Typography>
            <DeviceList
                devices={devices}
                setSelectedDevice={setSelectedDevice}
                fetchDevices={fetchDevices}
                showSnackbar={showSnackbar}
            />
            <SnackbarNotification
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleCloseSnackbar}
            />
        </Container>
    );
}

export default App;