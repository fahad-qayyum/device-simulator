const {getDB} = require('./db');

/**
 * Creates a new device and its states in the database.
 * @param {string} name - The name of the device.
 * @param {string} type - The type of the device.
 * @param {Object} state - The state of the device.
 * @returns {Promise<Object>} The newly created device with its states.
 */
const createDevice = async (name, type, state) => {
    const db = getDB();
    const [result] = await db.execute('INSERT INTO devices (name, type) VALUES (?, ?)', [name, type]);
    const deviceId = result.insertId;

    const statePromises = Object.entries(state).map(([stateName, stateValue]) =>
        db.execute('INSERT INTO device_states (device_id, state_name, state_value) VALUES (?, ?, ?)', [deviceId, stateName, stateValue])
    );
    await Promise.all(statePromises);

    return {id: deviceId, name, type, state};
};

/**
 * Retrieves all devices and their states from the database.
 * @returns {Promise<Array>} An array of devices with their states.
 */
const getAllDevices = async () => {
    const db = getDB();
    const [devices] = await db.execute('SELECT * FROM devices');
    const [states] = await db.execute('SELECT * FROM device_states');

    return devices.map(device => {
        const deviceStates = states.filter(state => state.device_id === device.id);
        const state = Object.fromEntries(deviceStates.map(s => [s.state_name, s.state_value]));
        return {...device, state};
    });
};

/**
 * Updates a device and its states in the database.
 * @param {number} deviceId - The ID of the device to update.
 * @param {string} name - The new name of the device.
 * @param {string} type - The new type of the device.
 * @param {Object} state - The new state of the device.
 * @returns {Promise<Object>} The updated device with its states.
 */
const updateDevice = async (deviceId, name, type, state) => {
    const db = getDB();
    await db.execute('UPDATE devices SET name = ?, type = ? WHERE id = ?', [name, type, deviceId]);

    const statePromises = Object.entries(state).map(async ([stateName, stateValue]) => {
        const [existingState] = await db.execute('SELECT * FROM device_states WHERE device_id = ? AND state_name = ?', [deviceId, stateName]);
        if (existingState.length > 0) {
            await db.execute('UPDATE device_states SET state_value = ? WHERE id = ?', [stateValue, existingState[0].id]);
        } else {
            await db.execute('INSERT INTO device_states (device_id, state_name, state_value) VALUES (?, ?, ?)', [deviceId, stateName, stateValue]);
        }
    });
    await Promise.all(statePromises);

    const [updatedDevice] = await db.execute('SELECT * FROM devices WHERE id = ?', [deviceId]);
    const [updatedStates] = await db.execute('SELECT * FROM device_states WHERE device_id = ?', [deviceId]);
    const updatedState = Object.fromEntries(updatedStates.map(s => [s.state_name, s.state_value]));

    return {...updatedDevice[0], state: updatedState};
};

/**
 * Deletes a device from the database.
 * @param {number} deviceId - The ID of the device to delete.
 * @returns {Promise<void>}
 */
const deleteDevice = async (deviceId) => {
    const db = getDB();
    await db.execute('DELETE FROM devices WHERE id = ?', [deviceId]);
};

module.exports = {
    createDevice,
    getAllDevices,
    updateDevice,
    deleteDevice
};