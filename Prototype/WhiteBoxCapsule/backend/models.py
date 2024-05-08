import json
from pydantic import BaseModel, field_validator, FilePath, model_validator
from typing import Optional
from schemas import AttemptType, ChallengeType, Difficulty, GameRoundState, PieceColor, UserType, GameState, GameMessage

# class Settings(BaseModel):
#     authjwt_secret_key: str = '8908b123cf7557c25430ac0c6e86a21c29061d3152b328f8163b8de394e0fb8f'


class PassingCriteria(BaseModel):
    preconditions: list[str]
    tests: list[str]
    expression_count: Optional[int] = None

class AchievementCriteria(BaseModel):
    preconditions: list[str]
    tests: list[str]

class Attempt(BaseModel):
    id: Optional[int]
    player_id: int
    challenge_id: int
    score: int
    attempt_type: AttemptType
    achievement: bool
    test_cases: dict
    game_round_id: Optional[int] = None
    comment: str
    comment_score_count: Optional[int] = None
    comment_score: Optional[float] = None

    class Config:
        from_attributes = True

class ChallengeComments(BaseModel):
    attempt_id: int
    challenge_id: int
    comment: str
    comment_score: Optional[float] = None

    class Config:
        from_attributes = True


class Challenge(BaseModel):
    id: Optional[int]
    name: str
    test_cases_count: int
    hint: str
    objective: str
    score: int
    initial_board: int
    code_file: int
    passing_criteria: PassingCriteria
    challenge_type: ChallengeType
    achievement: Optional[str] = None
    achievement_hint: Optional[str] = None
    owner_id: int
    difficulty: Difficulty

    class Config:
        from_attributes = True


class ChallengeBasics(BaseModel):
    id: Optional[int]
    name: str
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
    validated: Optional[bool] = None

    class Config:
        from_attributes = True


class UserBasics(BaseModel):
    id: Optional[int]
    name: str
    username: str
    picture: str
    email: str
    failed_attempts: int
    successful_attempts: int
    score: int
    achievements: int
    user_type: UserType
    validated: Optional[bool] = None

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
    validated: Optional[bool] = None


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
    game_winner: Optional[list[int]] = None

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
    last_round_id: Optional[int] = None
    pass_round: Optional[int] = None
    game_winner_1_id: Optional[int]
    game_winner_2_id: Optional[int]
    game_winner_3_id: Optional[int]
    
class GameLog(BaseModel):
    id: Optional[int]
    game_room_id: int
    user_id: Optional[int] = None
    message: GameMessage
    game_round_id: Optional[int] = None

    class Config:
        from_attributes = True

class GameRound(BaseModel):
    id: Optional[int]
    user_id: int
    game_room_id: int
    challenge_id: int
    max_rounds: int
    round_number: int
    state: GameRoundState
    
    class Config:
        from_attributes = True
    
    @model_validator(mode='after')
    @classmethod
    def validate_round_number(cls, self):
        if (self.round_number < 1 and self.round_number != -1):
            raise ValueError("A round number must be at least 1.")
        elif (self.round_number > self.max_rounds):
            raise ValueError("A round number must be at most the maximum number of rounds.")
        return self
    
class GameRoomSummary(BaseModel):
    round_id: int
    player_id: int
    score: int
    challenge: str

class CodeFileDictionary(BaseModel):
    expression: str
    replacement: str
    
class AttemptScore(BaseModel):
    id: Optional[int]
    user_id: int
    attempt_id: int
    challenge_id: int
    given_score: int