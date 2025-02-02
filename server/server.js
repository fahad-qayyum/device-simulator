const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {connectDB} = require('./db');
const routes = require('./routes/routes');
require('./wsOperations'); // Initialize WebSocket server

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to use defined routes
app.use(routes);

// Immediately invoked function expression (IIFE) to connect to the database and start the server
(async () => {
    await connectDB(); // Connect to the database
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`)); // Start the server
})();