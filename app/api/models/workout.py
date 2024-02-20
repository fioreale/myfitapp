from typing import List

from pydantic import BaseModel


class Serie(BaseModel):
    series: int
    reps: str
    carico: str


class Esercizio(BaseModel):
    name: str
    serie: Serie


class Scheda(BaseModel):
    name: str
    esercizi: List[Esercizio]


class Workout(BaseModel):
    name: str
    schede: List[Scheda]
