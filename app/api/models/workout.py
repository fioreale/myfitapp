from typing import List
from pydantic import BaseModel, validator


class Serie(BaseModel):
    reps: str
    carico: str

    @validator("reps")
    def reps_must_be_feasible(cls, v):
        try:
            int(v)
        except:
            raise ValueError("reps must be integer")
        return v


class Esercizio(BaseModel):
    name: str
    serie: List[Serie]


class Scheda(BaseModel):
    name: str
    esercizi: List[Esercizio]


class Workout(BaseModel):
    name: str
    schede: List[Scheda]
