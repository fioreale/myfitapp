import json
import logging

from pymongo import MongoClient

from ..api.models.workout import Scheda, Workout

client = MongoClient(
    host="ferretdb.internal",
    port=27017,
    username="username",
    password="password",
    authMechanism="PLAIN",
)
db = client["myfitappdb"]
collection = db["workouts"]


def getWorkoutDB(name: str):
    try:
        return collection.find_one({"name": name})

    except Exception as e:
        logging.error(f"Failed to get item {name}: {e}")
        return None


def getWorkoutList():
    try:
        return [doc["name"] for doc in collection.find({}, {"name": 1})]

    except Exception as e:
        logging.error(f"Failed to get workout list: {e}")
        return None


def loadWorkoutDB(workout: Workout) -> bool:
    workout_data = json.dumps(workout.model_dump())
    try:
        if getWorkoutDB(workout.name) is None:
            collection.insert_one({"name": workout.name, "data": workout_data})

        else:
            collection.update_one(
                {"name": workout.name}, {"$set": {"data": workout_data}}
            )

        return True
    except Exception as e:
        logging.error(f"Failed to write item {workout.name}: {e}")
        return False


def updateWorkout(name: str, scheda: Scheda) -> bool:
    try:
        workout_dump = getWorkoutDB(name)

        if workout_dump is not None:
            workout_dict = json.loads(workout_dump.get("data"))
            workout_data = Workout(**workout_dict)

            for idx, s in enumerate(workout_data.schede):
                if s.name == scheda.name:
                    workout_data.schede[idx] = scheda

            if loadWorkoutDB(workout_data):
                return True
            else:
                logging.error(
                    f"Failed to update workout {name}: Cannot write new one on DB!"
                )
                return False
        else:
            logging.error(f"Failed to update workout {name}: It does not exist!")
            return False

    except Exception as e:
        logging.error(f"Failed to update workout {name}: {e}")
        return False


def deleteWorkout(name: str) -> bool:
    try:
        res = collection.delete_one({"name": name})
        if res.deleted_count == 1:
            return True
        else:
            return False
    except Exception as e:
        logging.error(f"Failed to get item {name}: {e}")
        return False
