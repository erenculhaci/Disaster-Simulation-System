# Communication Tower Deployment - Disaster Simulation Software

This project is a communication tower deployment simulation software. The goal is to deploy communication towers efficiently in high-risk areas and visualize the effect of the disaster on the network system and mesh network.

## Features

- Click on the map to place communication towers (nodes).
- Visual mesh network between towers.
- Retained mesh structure after node destruction (post-delete).
- Simulation of disaster scenarios to determine network safety.

## Technologies Used

- **Frontend**: React, Leaflet.js (for maps)
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL

## Prerequisites

Before running the project, make sure you have the following installed and correctly added to PATH:

- Node.js (version 14.x or higher)
- PostgreSQL (installed and running)
- Git

## Getting Started

### 1. Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/erenculhaci/Disaster-Simulation-System.git
cd Disaster-Simulation-System
```
### 2. Backend Setup (Node.js + PostgreSQL)

Navigate to the backend directory:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```
Create a PostgreSQL database (make sure your PostgreSQL service is running):

```bash
CREATE DATABASE communication_tower_db;
```

Update the db.js file with your PostgreSQL username and password.

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup (React)
Navigate to the frontend directory:
```bash
cd ../communication-tower-app
```
Install the frontend dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm start
```
