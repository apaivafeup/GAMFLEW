import json
from pydantic import BaseModel, field_validator
from typing import Optional
from schemas import AttemptType, ChallengeType, Difficulty

class PassingCriteria(BaseModel):
    preconditions: list[str]
    tests: list[str]
    condition_count: Optional[int] = None

class AchievementCriteria(BaseModel):
    preconditions: list[str]
    tests: list[str]

class Attempt(BaseModel):
    id: Optional[int]
    player_id: int
    challenge_id: int
    time_elapsed: int
    score: int
    attempt_type: AttemptType
    comment: str
    test_cases: dict

    class Config:
        from_attributes = True

class Challenge(BaseModel):
    id: Optional[int]
    name: str
    description: str
    test_cases_count: int
    hint: str
    objective: str
    timer_value: int
    initial_board: str
    code_file: int
    passing_criteria: PassingCriteria
    challenge_type: ChallengeType
    achievement_criteria: Optional[dict] = None
    owner_id: int
    difficulty: Difficulty

    class Config:
        from_attributes = True


class ChallengeBasics(BaseModel):
    id: Optional[int]
    name: str
    description: str
    code_file: str
    passing_criteria: dict
    timer_value: int
    challenge_type: ChallengeType
    owner_id: int
    difficulty: Difficulty
    initial_board: str

    class Config:
        from_attributes = True


class User(BaseModel):
    id: Optional[int]
    name: str
    email: str
    password: str
    failed_attempts: int
    successful_attempts: int
    score: int
    achievements: int

    class Config:
        from_attributes = True

class UserBasics(BaseModel):
    id: Optional[int]
    name: str
    email: str
    failed_attempts: int
    successful_attempts: int
    score: int
    achievements: int

    class Config:
        from_attributes = True

class CodeFile(BaseModel):
    id: Optional[int]
    name: str
    content: str

    class Config:
        from_attributes = True