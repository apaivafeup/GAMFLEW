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

class CodeFile(Base):
    __tablename__ = "code_file"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    content = Column(TEXT, index=True)
    dictionary = Column(PickleType, index=True)

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
