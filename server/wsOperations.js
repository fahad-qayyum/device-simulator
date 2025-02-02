const WebSocket = require('ws');

// Create a new WebSocket server on port 3003
const wss = new WebSocket.Server({port: 3003}, () => {
    console.log('WebSocket server is running on ws://localhost:3003');
});

/**
 * Broadcasts a message to all connected clients.
 * @param {Object} message - The message to broadcast.
 */
const broadcast = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

// Event listener for new connections
wss.on('connection', ws => {
    console.log('Client connected');

    // Event listener for client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = {
    wss,
    broadcast
};