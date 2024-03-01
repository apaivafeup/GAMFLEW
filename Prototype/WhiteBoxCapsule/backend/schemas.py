from sqlalchemy import PickleType, Boolean, Column, ForeignKey, Integer, TEXT, DateTime
from sqlalchemy.orm import relationship, declarative_base
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
    FINISHED = "finished"

class GameMessage(str, Enum):
    """Enum for the messages of the game."""
    ENTER = "enter"
    LEAVE = "leave"
    START = "start"
    END = "end"

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

    attempts = relationship("Attempt", back_populates="user")
    challenges = relationship("Challenge", back_populates="user")
    game_winner = relationship("GameRoom", back_populates="winner", foreign_keys="GameRoom.game_winner")
    first_player = relationship("GameRoom", back_populates="player_1", foreign_keys="GameRoom.player_1_id")
    second_player = relationship("GameRoom", back_populates="player_2", foreign_keys="GameRoom.player_2_id")
    third_player = relationship("GameRoom", back_populates="player_3", foreign_keys="GameRoom.player_3_id")
    game_logs = relationship("GameLog", back_populates="users")

class CodeFile(Base):
    __tablename__ = "code_file"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    content = Column(TEXT, index=True)
    dictionary = Column(PickleType, index=True, nullable=True)

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

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True)
    score = Column(Integer, index=True)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    attempt_type = Column(ENUM(AttemptType), nullable=False, default=AttemptType.PASS, index=True)
    comment = Column(TEXT, index=True)
    test_cases = Column(PickleType)

    user = relationship("User", back_populates="attempts")
    challenge = relationship("Challenge", back_populates="attempts")

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
    game_winner = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    game_logs = relationship("GameLog", back_populates="game_rooms") # this is the correct way
    winner = relationship("User", back_populates="game_winner", foreign_keys="GameRoom.game_winner")
    player_1 = relationship("User", back_populates="first_player", foreign_keys="GameRoom.player_1_id")
    player_2 = relationship("User", back_populates="second_player", foreign_keys="GameRoom.player_2_id")
    player_3 = relationship("User", back_populates="third_player", foreign_keys="GameRoom.player_3_id")

class GameLog(Base):
    __tablename__ = "game_logs"

    id = Column(Integer, primary_key=True)
    message = Column(ENUM(GameMessage), index=True)
    game_room_id = Column(Integer, ForeignKey("game_rooms.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    game_rooms = relationship("GameRoom", back_populates="game_logs")
    users = relationship("User", back_populates="game_logs")