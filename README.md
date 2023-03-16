# myFitApp

This is a microservices application for tracking gym workouts, built with [FastAPI](https://fastapi.tiangolo.com/) and [MongoDB](https://www.mongodb.com/). The application consists of two microservices:

- *workouts*: A FastAPI microservice for creating, retrieving, updating, and deleting workouts.
- *mongo*: A MongoDB microservice for storing and managing workout data.

## Prerequisites

Before you can run the application, you need to have the following tools installed on your system:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Usage

### Creating a Workout

To create a workout, send a POST request to the /workouts endpoint of the workouts microservice with a JSON payload containing the workout data. This will create a new workout with the specified data.

### Retrieving a Workout

To retrieve a workout, send a GET request to the /workouts/{workout_id} endpoint of the workouts microservice, where workout_id is the ID of the workout you want to retrieve.

### Retrieving the list of Workouts

To retrieve a workout, send a GET request to the /workouts/{workout_id} endpoint of the workouts microservice, where workout_id is the ID of the workout you want to retrieve.

### Updating a Workout

To update a workout, send a PATCH request to the /workouts/{workout_id} endpoint of the workouts microservice, where workout_id is the ID of the workout you want to update, with a JSON payload containing the updated 'Scheda' data.


