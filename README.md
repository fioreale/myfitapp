# 🏋️‍♀️ myFitApp 🚀

This is a cloud-native application for tracking gym workouts, built with FastAPI as the backend and SvelteKit for the frontend.

## Purpose and Intention 🎯

myFitApp aims to provide a comprehensive solution for individuals to easily track and manage their gym workouts. The project serves as a showcase for integrating FastAPI and SvelteKit, demonstrating how these modern technologies can be combined to create a full-stack web application.

## Technologies Used 💻

### Backend 🔧
- FastAPI: A modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.
- Python: The primary programming language for the backend logic.

### Frontend 🖥️
- SvelteKit: An application framework powered by Svelte, providing server-side rendering, routing, and other features out of the box.
- TypeScript: Used for enhanced type safety and developer productivity in the frontend code.

## Features 🌟

- Create, read, update, and delete (CRUD) operations for workout data
- RESTful API endpoints for managing workouts
- Responsive and interactive user interface for easy data entry and visualization

## Getting Started 🛠️

To get started with the project, please refer to the setup instructions below.

## Deployment Guide

### Prerequisites

- Docker installed on your system
- Node.js and npm installed on your system

### Step 1: Clone the Repository 

Clone the repository to your local machine:

```bash
git clone https://github.com/fioreale/myfitapp.git
cd myfitapp
```

### Step 2: Build and Start the Backend

Use Docker Compose to build and start the backend service:

```bash
docker-compose up --build
```

This will build the Docker image and start the container. The backend will be available at `http://localhost:8000`.

### Step 3: Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd src/myfitapp/front/myfitapp-ui
npm install
```

### Step 4: Build the Frontend

Build the frontend application:

```bash
npm run build
```

### Step 5: Serve the Frontend

Serve the built frontend:

```bash
npm run preview
```

The frontend will be available at `http://localhost:4173`.

### Step 6: Access the Application

Open a web browser and navigate to `http://localhost:4173` to access the myFitApp frontend. The frontend will communicate with the backend running at `http://localhost:8000`.

## Contribution Guidelines 🤝

I encourage contributions and improvements from the community! If you're interested in enhancing this project or adding new features, I welcome your input. Here are ways you can contribute:

1. Create issues for bug reports or feature requests
2. Fork the project and submit pull requests with your changes
3. Participate in discussions on existing issues

Our goal is to maintain a high-quality, open-source solution that demonstrates best practices for building full-stack applications with FastAPI and SvelteKit. Your contributions help us achieve this goal and provide value to the wider developer community.

Thank you for your interest in myFitApp!
