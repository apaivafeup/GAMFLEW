import json
from pydantic import BaseModel, field_validator
from typing import Optional
from schemas import AttemptType, ChallengeType, Difficulty, PieceColor

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
    score: int
    initial_board: int
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
    score: int
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
    dictionary: dict

    class Config:
        from_attributes = True

class Stack(BaseModel):
    red: int
    blue: int

class Piece(BaseModel):
    color: PieceColor
    content: Optional[Stack] = None

    @field_validator("content")
    @classmethod
    def validate_content(cls, content, color):
        if color == PieceColor.STACK:
            if content == None:
                raise ValueError("A stack most define its content.")
            elif content.red + content.blue < 2:
                raise ValueError("A stack must include at least 2 pieces.")
        else:
            if content != None:
                raise ValueError("Only stacks can have their content defined.")
        return content

class BoardState(BaseModel):
    id: Optional[int]
    name: str
    board_state: list[list[Piece]]
    out_of_bounds_state: Piece
