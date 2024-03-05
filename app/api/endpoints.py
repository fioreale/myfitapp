
from fastapi import APIRouter, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.db.volume import (deleteWorkout, getWorkout, getWorkoutList,
                               loadWorkout, updateWorkout)

from .models import Scheda, Workout

router = APIRouter()


@router.get("/workout/{name}")
async def get_workout(name: str):
    if not name:
        raise HTTPException(status_code=400, detail="Name parameter cannot be empty")

    try:
        workout_db = getWorkout(name)

        if workout_db is not None:
            workout_data = Workout(**workout_db)

            return workout_data
        else:
            raise HTTPException(status_code=400, detail="No workout to load")
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@router.delete("/workout/{name}")
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


@router.get("/workout")
async def get_workout_list():
    try:
        workout_list_data = getWorkoutList()

        return workout_list_data
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@router.post("/workout")
async def load_workout(workout: Workout):
    try:
        if loadWorkout(workout):
            return JSONResponse(
                status_code=200, content={"message": "Workout upload successful"}
            )
        else:
            return JSONResponse(
                status_code=500, content={"message": "Cannot upload workout"}
            )
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@router.patch("/workout/{name}")
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
