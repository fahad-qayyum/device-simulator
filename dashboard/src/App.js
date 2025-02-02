import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Container, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';

/**
 * The main component of the IoT Device Dashboard application.
 * Fetches device data from a REST API and listens for updates via WebSocket.
 * Displays the device data in a data grid.
 *
 * @component
 */
const App = () => {
    const [devices, setDevices] = useState([]);

    /**
     * Fetches the initial list of devices from the REST API and sets up the WebSocket connection.
     * Updates the device list based on WebSocket messages.
     */
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const {data} = await axios.get('http://localhost:3000/devices');
                setDevices(data);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();

        const ws = new WebSocket('ws://localhost:3003');

        ws.onopen = () => console.log('WebSocket connection opened');
        ws.onmessage = ({data}) => {
            const updatedDevice = JSON.parse(data);

            setDevices((prevDevices) => {
                if (updatedDevice.deleted) {
                    return prevDevices.filter((device) => device.id !== updatedDevice.id);
                }

                const existingDevice = prevDevices.find((device) => device.id === updatedDevice.id);
                if (existingDevice) {
                    return prevDevices.map((device) =>
                        device.id === updatedDevice.id ? updatedDevice : device
                    );
                }

                return [...prevDevices, updatedDevice];
            });
        };

        ws.onclose = () => console.log('WebSocket connection closed');
        ws.onerror = (error) => console.error('WebSocket error:', error);

        return () => ws.close();
    }, []);

    const columns = [
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'type', headerName: 'Type', width: 150},
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            renderCell: ({row: {state}}) => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: Object.entries(state)
                            .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
                            .join(', '),
                    }}
                />
            ),
        },
    ];

    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom>
                IoT Device Dashboard
            </Typography>
            <Typography variant="h4" gutterBottom>
                Device List
            </Typography>
            <Box sx={{height: '100%', width: '100%'}}>
                <DataGrid rows={devices} columns={columns} pageSize={5} rowsPerPageOptions={[5]}
                          getRowId={(row) => row.id}/>
            </Box>
        </Container>
    );
};

export default App;