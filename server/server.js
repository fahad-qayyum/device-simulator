const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

// Database connection
const dbConfig = {
  host: 'database',
  user: 'root',
  password: 'password',
  database: 'acme_iot'
};

let db;
(async () => {
  db = await mysql.createConnection(dbConfig);
  await db.execute(`CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create a new device
  app.post('/devices', async (req, res) => {
    const { name, type, state } = req.body;
    const [result] = await db.execute('INSERT INTO devices (name, type, state) VALUES (?, ?, ?)', [name, type, JSON.stringify(state)]);
    const id = result.insertId;
    res.status(201).json({ id, name, type, state });
  });

// Get all devices
app.get('/devices', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM devices');
  res.json(rows.map(device => ({
    ...device,
    state: JSON.parse(device.state)
  })));
});

  // Get a single device
  app.get('/devices/:id', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM devices WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ ...rows[0], state: JSON.parse(rows[0].state) });
  });

  // Update a device state
  app.put('/devices/:id', async (req, res) => {
    const { state } = req.body;
    await db.execute('UPDATE devices SET state = ? WHERE id = ?', [JSON.stringify(state), req.params.id]);
    res.json({ message: 'Device updated' });
  });

  // Delete a device
  app.delete('/devices/:id', async (req, res) => {
    await db.execute('DELETE FROM devices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Device deleted' });
  });

  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
})();