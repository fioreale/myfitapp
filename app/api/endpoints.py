from fastapi import APIRouter, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.db.volume import (
    delete_workout_file,
    read_workout_from_json,
    list_all_workouts,
    save_workout_to_json,
    update_workout_in_json,
)
from .models import Scheda, Workout

router = APIRouter()


@router.get("/workout/{name}")
async def get_workout(name: str):
    if not name:
        raise HTTPException(status_code=400, detail="Name parameter cannot be empty")

    try:
        workout_db = read_workout_from_json(name)

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
        res = delete_workout_file(name)

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
        workout_list_data = list_all_workouts()

        return workout_list_data
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())


@router.post("/workout")
async def load_workout(workout: Workout):
    try:
        if save_workout_to_json(workout):
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
        if update_workout_in_json(name, scheda):
            return JSONResponse(
                status_code=200, content={"message": "Workout upload successful"}
            )
        else:
            return JSONResponse(
                status_code=500, content={"message": "Cannot upload workout"}
            )
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors())
