from pydantic import BaseModel
from typing import Optional
from schemas import AttemptType

class Attempt(BaseModel):
    id: Optional[int]
    player_id: int
    challenge_id: int
    time_elapsed: int
    score: int
    attempt_type: AttemptType
    comment: str

    class Config:
        from_attributes = True

class Challenge(BaseModel):
    id: Optional[int]
    name: str
    count: int
    hint: str
    objective: str
    timer: int
    board: str
    code_file: str
    submit_function: str
    owner_id: int

    class Config:
        from_attributes = True


class User(BaseModel):
    id: Optional[int]
    name: str
    email: str
    password: str

    class Config:
        from_attributes = True
