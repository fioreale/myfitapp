import json
import logging
from pathlib import Path
from typing import List, Optional

from ..model import Scheda, Workout

# Define the directory where workout files will be stored
DATA_DIR = Path("/data")  # Update this path as needed


def get_workout_file_path(name: str) -> Path:
    """Generate a file path for a given workout name."""
    return DATA_DIR / f"{name}.json"


def getWorkout(name: str) -> Optional[dict]:
    """Retrieve a workout from a JSON file."""
    file_path = get_workout_file_path(name)
    try:
        if file_path.exists():
            with file_path.open("r") as file:
                return json.load(file)
    except Exception as e:
        logging.error(f"Failed to get item {name}: {e}")
    return None


def getWorkoutList() -> List[str]:
    """List all workouts by scanning the data directory for JSON files."""
    try:
        return [f.stem for f in DATA_DIR.glob("*.json")]
    except Exception as e:
        logging.error(f"Failed to get workout list: {e}")
        return []


def loadWorkout(workout: Workout) -> bool:
    """Save a workout to a JSON file."""
    file_path = get_workout_file_path(workout.name)
    try:
        with file_path.open("w") as file:
            json.dump(workout.model_dump(), file)
        return True
    except Exception as e:
        logging.error(f"Failed to write item {workout.name}: {e}")
        return False


def updateWorkout(name: str, scheda: Scheda) -> bool:
    """Update a workout by modifying its JSON file."""
    workout_data = getWorkout(name)
    try:
        if workout_data:
            workout_obj = Workout(**workout_data)

            for idx, s in enumerate(workout_obj.schede):
                if s.name == scheda.name:
                    workout_obj.schede[idx] = scheda

            if loadWorkout(workout_obj):
                return True
            else:
                logging.error(
                    f"Failed to update workout {name}: Cannot write new one on DB!"
                )
                return False
        else:
            logging.error(f"Failed to update workout {name}: It does not exist!")
            return False
    except Exception:
        logging.error(f"Failed to update workout {name}: It does not exist!")
        return False


def deleteWorkout(name: str) -> bool:
    """Delete a workout's JSON file."""
    file_path = get_workout_file_path(name)
    try:
        file_path.unlink(missing_ok=True)
        return True
    except Exception as e:
        logging.error(f"Failed to delete item {name}: {e}")
        return False
