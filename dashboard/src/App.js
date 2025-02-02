import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Container, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';

const App = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/devices');
                console.log('Fetched devices:', response.data); // Debugging line
                setDevices(response.data);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []); // Empty dependency array ensures this runs only once

    const columns = [
        {field: 'id', headerName: 'ID', width: 150},
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'type', headerName: 'Type', width: 150},
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            renderCell: (params) => {
                const state = params.row.state;
                const stateString = Object.entries(state)
                    .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
                    .join(', ');
                return <div dangerouslySetInnerHTML={{__html: stateString}}/>;
            }
        },
    ];

    return (
        <Container>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                IoT Device Dashboard
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
                Device List
            </Typography>
            <Box sx={{height: 400, width: '100%'}}>
                <DataGrid rows={devices} columns={columns} pageSize={5} rowsPerPageOptions={[5]}/>
            </Box>
        </Container>
    );
};

export default App;