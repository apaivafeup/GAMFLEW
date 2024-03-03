import json
from pydantic import BaseModel, field_validator, FilePath, model_validator
from typing import Optional
from schemas import AttemptType, ChallengeType, Difficulty, PieceColor, UserType, GameState, GameMessage

# class Settings(BaseModel):
#     authjwt_secret_key: str = '8908b123cf7557c25430ac0c6e86a21c29061d3152b328f8163b8de394e0fb8f'


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
    username: str
    email: str
    password: str
    picture: str
    user_type: UserType
    failed_attempts: int
    successful_attempts: int
    score: int
    achievements: int
    auth: bool

    class Config:
        from_attributes = True


class UserBasics(BaseModel):
    id: Optional[int]
    name: str
    username: str
    picture: str
    failed_attempts: int
    successful_attempts: int
    score: int
    achievements: int
    user_type: UserType

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    name: str
    username: str
    email: str
    picture: str
    password: str
    user_type: UserType


class UserResponse(BaseModel):
    name: str
    username: str
    email: str
    picture: str
    user_type: UserType


class UserAuth(BaseModel):
    username: str
    auth: bool


class CodeFile(BaseModel):
    id: Optional[int]
    name: str
    content: str
    dictionary: Optional[dict] = None

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

# Token
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

class TokenData(BaseModel):
    username: str | None = None

class UserInDB(User):
    hashed_password: str

class GameRoom(BaseModel):
    id: Optional[int]
    name: str
    rounds: int
    player_number: int
    player_1_id: int
    player_2_id: Optional[int] = None
    player_3_id: Optional[int] = None
    game_state: Optional[GameState] = GameState.WAITING
    game_over: bool = False
    game_winner: Optional[int] = None

    class Config:
        from_attributes = True

    @field_validator("rounds")
    @classmethod
    def validate_rounds(cls, rounds):
        if rounds < 1:
            raise ValueError("A game must have at least 1 round.")
        elif rounds > 5:
            raise ValueError("A game must have at most 5 rounds.")
        return rounds

    @model_validator(mode='after')
    @classmethod
    def validate_players(cls, self):
        if (self.player_3_id is None):
            if (self.player_1_id == self.player_2_id):
                raise ValueError("A game must have at least 2 and at most 3 different players.")
        else:
            if self.player_1_id == self.player_2_id or self.player_1_id == self.player_3_id or self.player_2_id == self.player_3_id:
                raise ValueError("A game must have at least 2 and at most 3 different players.")
        return self

    
class GameRoomState(BaseModel):
    id: Optional[int]
    players_in: list[int]
    game_state: GameState
    game_over: bool
    game_winner: Optional[int]
    
class GameLog(BaseModel):
    id: Optional[int]
    game_room_id: int
    user_id: int
    message: GameMessage

    class Config:
        from_attributes = True

