const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database configuration object using environment variables.
 * @type {Object}
 * @property {string} host - The database host.
 * @property {string} user - The database user.
 * @property {string} password - The database password.
 * @property {string} database - The database name.
 */
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let db;

/**
 * Connects to the database and creates necessary tables.
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    db = await mysql.createConnection(dbConfig);
    await createTables();
};

/**
 * Creates the necessary tables in the database if they do not exist.
 * @async
 * @function createTables
 * @returns {Promise<void>}
 */
const createTables = async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS devices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS device_states (
            id INT AUTO_INCREMENT PRIMARY KEY,
            device_id INT NOT NULL,
            state_name VARCHAR(255) NOT NULL,
            state_value VARCHAR(255),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
        )
    `);
};

/**
 * Returns the database connection object.
 * @function getDB
 * @returns {Object} The database connection object.
 */
const getDB = () => db;

module.exports = {
    connectDB,
    getDB
};