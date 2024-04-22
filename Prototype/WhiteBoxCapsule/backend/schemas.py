from sqlalchemy import PickleType, Boolean, Column, ForeignKey, Integer, TEXT, DateTime, Float
from sqlalchemy.orm import relationship, declarative_base, backref
from dotenv import load_dotenv   #for python-dotenv method
import os
from enum import Enum


load_dotenv()

local = eval(os.environ.get('LOCAL'))

if not local: 
    from sqlalchemy.dialects.mysql import ENUM, TEXT
else:
    from sqlalchemy.dialects.postgresql import ENUM

Base = declarative_base()

class AttemptType(str, Enum):
    """Enum for the type of attempt."""
    PASS = "pass"
    FAIL = "fail"

class ChallengeType(str, Enum):
    """Enum for the type of challenge."""
    STATEMENT = "statement"
    DECISION = "decision"
    CONDITION = "condition"
    CONDITION_DECISION = "condition/decision"
    MCDC = "mcdc"

class Difficulty(str, Enum):
    """Enum for the difficulty of challenge."""
    VERY_EASY = "Very Easy"
    EASY = "Easy"
    NORMAL = "Normal"
    HARD = "Hard"
    VERY_HARD = "Very Hard"

class PieceColor(str, Enum):
    """Enum for the piece colors."""
    RED = "red"
    BLUE = "blue"
    EMPTY = "empty"
    STACK = "stack"

class UserType(str, Enum):
    """Enum for the type of user."""
    PLAYER = "player"
    ADMIN = "admin"

class GameState(str, Enum):
    """Enum for the state of the game."""
    WAITING = "waiting"
    READY = "ready"
    PLAYING = "playing"
    PASS_ROUND = "pass_round"
    NEXT_ROUND = "next_round"
    FINISHED = "finished"

class GameMessage(str, Enum):
    """Enum for the messages of the game."""
    ENTER = "enter"
    LEAVE = "leave"
    START = "start"
    AUTO_PASS = "auto_pass"
    PASS = "pass"
    NEXT_ROUND = "next_round"
    END = "end"

class GameRoundState(str, Enum):
    """Enum for the state of the game round."""
    ONGOING = "ongoing"
    FINISHED = "finished"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, unique=True, index=True)
    email = Column(TEXT, unique=True, index=True)
    username = Column(TEXT, unique=True, index=True)
    picture = Column(TEXT, index=True, nullable=True)
    user_type = Column(ENUM(UserType), nullable=False, default=UserType.PLAYER, index=True)
    password = Column(TEXT)
    failed_attempts = Column(Integer, index=True)
    successful_attempts = Column(Integer, index=True)
    score = Column(Integer, index=True)
    achievements = Column(Integer, index=True)
    auth = Column(Boolean, default=True, index=True)
    validated = Column(Boolean, nullable=True, index=True)

    attempts = relationship("Attempt", back_populates="user")
    challenges = relationship("Challenge", back_populates="user")
    game_winner_1 = relationship("GameRoom", back_populates="winner_1", foreign_keys="GameRoom.game_winner_1_id")
    game_winner_2 = relationship("GameRoom", back_populates="winner_2", foreign_keys="GameRoom.game_winner_2_id")
    game_winner_3 = relationship("GameRoom", back_populates="winner_3", foreign_keys="GameRoom.game_winner_3_id")
    first_player = relationship("GameRoom", back_populates="player_1", foreign_keys="GameRoom.player_1_id")
    second_player = relationship("GameRoom", back_populates="player_2", foreign_keys="GameRoom.player_2_id")
    third_player = relationship("GameRoom", back_populates="player_3", foreign_keys="GameRoom.player_3_id")
    game_logs = relationship("GameLog", back_populates="users")
    game_rounds = relationship("GameRound", back_populates="users")
    attempt_scores = relationship("AttemptScore", back_populates="users")

class CodeFile(Base):
    __tablename__ = "code_file"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    content = Column(TEXT, index=True)

    challenges = relationship("Challenge", back_populates="code_files")

class BoardState(Base):
    __tablename__ = "board_state"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    board_state = Column(PickleType, index=True)
    out_of_bounds_state = Column(PickleType, index=True)

    challenges = relationship("Challenge", back_populates="board_states")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    description = Column(TEXT, index=True)
    hint = Column(TEXT, index=True)
    objective = Column(TEXT, index=True)
    test_cases_count = Column(Integer, index=True)
    score = Column(Integer, index=True)
    initial_board = Column(Integer, ForeignKey("board_state.id"), index=True, nullable=True)
    code_file = Column(Integer, ForeignKey("code_file.id"), nullable=False, index=True)
    challenge_type = Column(ENUM(ChallengeType), nullable=False, default=ChallengeType.STATEMENT, index=True)
    passing_criteria = Column(PickleType)
    achievement_criteria = Column(PickleType, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    difficulty = Column(ENUM(Difficulty), index=True)

    user = relationship("User", back_populates="challenges")
    attempts = relationship("Attempt", back_populates="challenge")
    code_files = relationship("CodeFile", back_populates="challenges")
    board_states = relationship("BoardState", back_populates="challenges")
    attempt_scores = relationship("AttemptScore", back_populates="challenges")

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True)
    score = Column(Integer, index=True)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    game_round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=True, index=True)
    attempt_type = Column(ENUM(AttemptType), nullable=False, default=AttemptType.PASS, index=True)
    test_cases = Column(PickleType)
    comment = Column(TEXT, index=True)
    comment_score = Column(Float, nullable=True, index=True)
    comment_score_count = Column(Integer, nullable=True, index=True)

    user = relationship("User", back_populates="attempts")
    challenge = relationship("Challenge", back_populates="attempts")
    game_rounds = relationship("GameRound", back_populates="attempts")
    attempt_scores = relationship("AttemptScore", back_populates="attempts")

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True)
    token = Column(TEXT, index=True)
    date = Column(DateTime, index=True)

class GameRoom(Base):
    __tablename__ = "game_rooms"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    rounds = Column(Integer, nullable=False, index=True)
    player_number = Column(Integer, nullable=False, index=True)
    player_1_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    player_2_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    player_3_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_state = Column(ENUM(GameState), index=True)
    game_over = Column(Boolean, default=False, index=True)
    game_winner_1_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_winner_2_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_winner_3_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    game_logs = relationship("GameLog", back_populates="game_rooms") # this is the correct way
    game_rounds = relationship("GameRound", back_populates="game_rooms")
    winner_1 = relationship("User", back_populates="game_winner_1", foreign_keys="GameRoom.game_winner_1_id")
    winner_2 = relationship("User", back_populates="game_winner_2", foreign_keys="GameRoom.game_winner_2_id")
    winner_3 = relationship("User", back_populates="game_winner_3", foreign_keys="GameRoom.game_winner_3_id")
    player_1 = relationship("User", back_populates="first_player", foreign_keys="GameRoom.player_1_id")
    player_2 = relationship("User", back_populates="second_player", foreign_keys="GameRoom.player_2_id")
    player_3 = relationship("User", back_populates="third_player", foreign_keys="GameRoom.player_3_id")

class GameLog(Base):
    __tablename__ = "game_logs"

    id = Column(Integer, primary_key=True)
    message = Column(ENUM(GameMessage), index=True)
    game_room_id = Column(Integer, ForeignKey("game_rooms.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=True, index=True)

    game_rooms = relationship("GameRoom", back_populates="game_logs")
    users = relationship("User", back_populates="game_logs")
    game_rounds = relationship("GameRound", back_populates="game_logs")

class GameRound(Base):
    __tablename__ = "game_rounds"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    game_room_id = Column(Integer, ForeignKey("game_rooms.id"), nullable=False, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False, index=True)
    round_number = Column(Integer, nullable=False, index=True)
    max_rounds = Column(Integer, nullable=False, index=True)
    state = Column(ENUM(GameRoundState), index=True)

    game_rooms = relationship("GameRoom", back_populates="game_rounds")
    users = relationship("User", back_populates="game_rounds")
    game_logs = relationship("GameLog", back_populates="game_rounds")
    attempts = relationship("Attempt", back_populates="game_rounds")

class CodeFileDictionary(Base):
    __tablename__ = "code_file_dictionary"

    id = Column(Integer, primary_key=True)
    expression = Column(TEXT, index=True, nullable=False)
    replacement = Column(TEXT, index=True, nullable=False)

class AttemptScore(Base):
    __tablename__ = "attempt_scores"

    id = Column(Integer, primary_key=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"), nullable=False, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    given_score = Column(Integer, index=True)

    attempts = relationship("Attempt", back_populates="attempt_scores")
    users = relationship("User", back_populates="attempt_scores")
    challenges = relationship("Challenge", back_populates="attempt_scores")