# ACME Prototype

## Overview

The ACME Prototype is a React-based application that allows users to simulate and manage IoT devices. The application includes a dashboard for device management, a server for handling API requests, and a simulator for testing device interactions.

## Features

- **Device Management**: Add, update, and delete devices.
- **Snackbar Notifications**: Display notifications for various actions and errors.
- **Dockerized Setup**: Easily set up and run the application using Docker and Docker Compose.

## Prerequisites

- Node.js 18.x
- Docker

## Running the Application

### Using Docker Compose

1. Build and start the containers:
    ```sh
    docker-compose up --build
    ```

2. Access the application:
    - Dashboard: `http://localhost:3001`
    - Simulator: `http://localhost:3002`

### Without Docker

1. Start the server:
    ```sh
    cd server
    npm start
    ```

2. Start the dashboard:
    ```sh
    cd dashboard
    npm start
    ```

3. Start the simulator:
    ```sh
    cd simulator
    npm start
    ```

## Project Structure

- `server/`: Contains the backend server code.
- `dashboard/`: Contains the React dashboard application.
- `simulator/`: Contains the React simulator application.
- `docker-compose.yml`: Docker Compose configuration file.
- `Dockerfile`: Dockerfile for building each container.

## Environment Variables

The following environment variables are used in the .env file of server:

- `DB_HOST`: Hostname for the database.
- `DB_USER`: Username for the database.
- `DB_PASSWORD`: Password for the database.
- `DB_NAME`: Name of the database.