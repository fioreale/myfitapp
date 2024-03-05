import json

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import ValidationError

from .api.models import Scheda, Workout
from .db.workout_db import (deleteWorkout, getWorkoutDB, getWorkoutList,
                            loadWorkoutDB, updateWorkout)

app = FastAPI()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": "Data validation failed", "detail": exc.errors()},
    )


@app.get("/workout/{name}")
async def get_workout(name: str):
    if not name:
        raise HTTPException(status_code=400, detail="Name parameter cannot be empty")

    try:
        workout_db = getWorkoutDB(name)

        if workout_db is not None:
            workout_dict = json.loads(workout_db.get("data"))

            workout_data = Workout(**workout_dict)

            return workout_data
        else:
            raise HTTPException(status_code=400, detail="No workout to load")
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@app.delete("/workout/{name}")
async def delete_workout(name: str):
    if not name:
        raise HTTPException(status_code=400, detail="Name parameter cannot be empty")

    try:
        res = deleteWorkout(name)

        if res:
            return JSONResponse(status_code=200, content={"message": "Workout deleted"})
        else:
            return JSONResponse(
                status_code=500, content={"message": "Cannot delete workout"}
            )
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@app.get("/workout")
async def get_workout_list():
    try:
        workout_list_data = getWorkoutList()

        return workout_list_data
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@app.post("/workout")
async def load_workout(workout: Workout):
    try:
        if loadWorkoutDB(workout):
            return JSONResponse(
                status_code=200, content={"message": "Workout upload successful"}
            )
        else:
            return JSONResponse(
                status_code=500, content={"message": "Cannot upload workout"}
            )
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@app.patch("/workout/{name}")
async def update_workout(name: str, scheda: Scheda):
    try:
        if updateWorkout(name, scheda):
            return JSONResponse(
                status_code=200, content={"message": "Workout upload successful"}
            )
        else:
            return JSONResponse(
                status_code=500, content={"message": "Cannot upload workout"}
            )
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


app.mount("/", StaticFiles(directory="app/public", html=True))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
