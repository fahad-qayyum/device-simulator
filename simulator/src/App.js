import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function App() {
    const [type, setType] = useState('');
    const [sensors, setSensors] = useState({});
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const createDevice = async () => {
        try {
            await axios.post('http://localhost:3000/devices', { type, sensors });
            fetchDevices();
            setType('');
            setSensors({});
        } catch (error) {
            console.error('Error creating device:', error);
        }
    };

    const deleteDevice = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/devices/${id}`);
            fetchDevices();
        } catch (error) {
            console.error('Error deleting device:', error);
        }
    };

    const updateDevice = async () => {
        try {
            await axios.put(`http://localhost:3000/devices/${selectedDevice.id}`, { type, sensors });
            fetchDevices();
            setSelectedDevice(null);
            setType('');
            setSensors({});
        } catch (error) {
            console.error('Error updating device:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                Device Simulator
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <TextField
                    label="Device Type"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Sensors"
                    value={JSON.stringify(sensors)}
                    onChange={e => setSensors(JSON.parse(e.target.value))}
                    fullWidth
                    multiline
                />
                <Button variant="contained" color="primary" onClick={selectedDevice ? updateDevice : createDevice}>
                    {selectedDevice ? 'Update Device' : 'Create Device'}
                </Button>
            </Box>
            <Typography variant="h4" component="h2" gutterBottom>
                Device List
            </Typography>
            <List>
                {devices.map(device => (
                    <ListItem key={device.id} divider>
                        <ListItemText
                            primary={device.type}
                            secondary={JSON.stringify(device.sensors)}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => {
                                setSelectedDevice(device);
                                setType(device.type);
                                setSensors(device.sensors);
                            }}>
                                <Edit />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteDevice(device.id)}>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default App;