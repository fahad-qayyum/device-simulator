const axios = require('axios');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiUrl = 'http://localhost:3000/devices';

const menu = `
Device Simulator Menu:
1. Create a device
2. Update a device state
3. Delete a device
4. List all devices
5. Exit
Choose an option: `;

const startSimulator = () => {
  rl.question(menu, async (choice) => {
    switch (choice) {
      case '1':
        rl.question('Enter device name: ', async (name) => {
          rl.question('Enter device type: ', async (type) => {
            const state = { status: 'active', temperature: Math.random() * 100 };
            const response = await axios.post(apiUrl, { name, type, state });
            console.log('Device created:', response.data);
            startSimulator();
          });
        });
        break;
      case '2':
        rl.question('Enter device ID: ', async (id) => {
          const newState = { status: 'updated', temperature: Math.random() * 100 };
          await axios.put(`${apiUrl}/${id}`, { state: newState });
          console.log('Device state updated.');
          startSimulator();
        });
        break;
      case '3':
        rl.question('Enter device ID to delete: ', async (id) => {
          await axios.delete(`${apiUrl}/${id}`);
          console.log('Device deleted.');
          startSimulator();
        });
        break;
      case '4':
        const response = await axios.get(apiUrl);
        console.log('Devices:', response.data);
        startSimulator();
        break;
      case '5':
        console.log('Exiting simulator.');
        rl.close();
        break;
      default:
        console.log('Invalid choice. Try again.');
        startSimulator();
    }
  });
};

startSimulator();
