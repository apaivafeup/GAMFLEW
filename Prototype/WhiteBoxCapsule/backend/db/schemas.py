from pydantic import BaseModel
from typing import List


class Attempt(BaseModel):
    id: int
    player_id: int
    challenge_id: int
    time_elapsed: int
    score: int

    class Config:
        from_attributes = True

class Challenge(BaseModel):
    id: int
    name: str
    count: int
    timer: int
    board: str
    code_file: str
    submit_function: str
    owner_id: int

    class Config:
        from_attributes = True


class User(BaseModel):
    id: int
    name: str
    email: str
    hashed_password: str
    attempts: List[Attempt]
    challenges: List[Challenge]

    class Config:
        from_attributes = True
