from sqlalchemy import PickleType, Boolean, Column, ForeignKey, Integer, TEXT, DateTime, Float
from sqlalchemy.orm import relationship, declarative_base, backref
from dotenv import load_dotenv   #for python-dotenv method
import os
from enum import Enum


load_dotenv()

local = True

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
    TEACHER = "teacher"
    ADMIN = "admin"

class GameState(str, Enum):
    """Enum for the state of the game."""
    WAITING = "waiting"
    READY = "ready"
    PLAYING = "playing"
    PASS_ROUND = "pass_round"
    SHOW_SOLUTION = "show_solution"
    NEXT_ROUND = "next_round"
    FINISHED = "finished"

class GameMessage(str, Enum):
    """Enum for the messages of the game."""
    ENTER = "enter"
    LEAVE = "leave"
    START = "start"
    AUTO_PASS = "auto_pass"
    PASS = "pass"
    SEEN_SOLUTION = "seen_solution"
    NEXT_ROUND = "next_round"
    RESET = "reset_round"
    END = "end"

class GameRoundState(str, Enum):
    """Enum for the state of the game round."""
    ONGOING = "ongoing"
    FINISHED = "finished"

class StudentClass(Base):
    __tablename__ = "student_classes"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, unique=True, index=True)
    teacher = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

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
    student_class = Column(Integer, ForeignKey("student_classes.id"), nullable=True, index=True)

    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    challenges = relationship("Challenge", back_populates="user", cascade="all, delete-orphan")
    game_winner_1 = relationship("GameRoom", back_populates="winner_1", foreign_keys="GameRoom.game_winner_1_id", cascade="all, delete-orphan")
    game_winner_2 = relationship("GameRoom", back_populates="winner_2", foreign_keys="GameRoom.game_winner_2_id", cascade="all, delete-orphan")
    game_winner_3 = relationship("GameRoom", back_populates="winner_3", foreign_keys="GameRoom.game_winner_3_id", cascade="all, delete-orphan")
    first_player = relationship("GameRoom", back_populates="player_1", foreign_keys="GameRoom.player_1_id", cascade="all, delete-orphan")
    second_player = relationship("GameRoom", back_populates="player_2", foreign_keys="GameRoom.player_2_id", cascade="all, delete-orphan")
    third_player = relationship("GameRoom", back_populates="player_3", foreign_keys="GameRoom.player_3_id", cascade="all, delete-orphan")
    game_logs = relationship("GameLog", back_populates="users", cascade="all, delete-orphan")
    game_rounds = relationship("GameRound", back_populates="users", cascade="all, delete-orphan")
    attempt_scores = relationship("AttemptScore", back_populates="users", cascade="all, delete-orphan")
    general_achievements = relationship("UserGeneralAchievement", back_populates="users", cascade="all, delete-orphan")

class CodeFile(Base):
    __tablename__ = "code_file"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True)
    content = Column(TEXT, index=True)

    challenges = relationship("Challenge", back_populates="code_files", cascade="all, delete-orphan")

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
    hint = Column(TEXT, index=True)
    objective = Column(TEXT, index=True)
    test_cases_count = Column(Integer, index=True)
    score = Column(Integer, index=True)
    initial_board = Column(Integer, ForeignKey("board_state.id"), index=True, nullable=True)
    code_file = Column(Integer, ForeignKey("code_file.id"), nullable=False, index=True)
    challenge_type = Column(ENUM(ChallengeType), nullable=False, default=ChallengeType.STATEMENT, index=True)
    passing_criteria = Column(PickleType)
    achievement = Column(TEXT, nullable=True)
    achievement_hint = Column(TEXT, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    difficulty = Column(ENUM(Difficulty), index=True)

    user = relationship("User", back_populates="challenges", cascade="all")
    attempts = relationship("Attempt", back_populates="challenge", cascade="all, delete-orphan")
    code_files = relationship("CodeFile", back_populates="challenges")
    board_states = relationship("BoardState", back_populates="challenges")
    attempt_scores = relationship("AttemptScore", back_populates="challenges", cascade="all")

class StudentClassChallenge(Base):
    __tablename__ = "student_class_challenge"

    id = Column(Integer, primary_key=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False, index=True)
    student_class_id = Column(Integer, ForeignKey("student_classes.id"), nullable=False, index=True)
    visible = Column(Boolean, default=False, index=True)

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True)
    score = Column(Integer, index=True)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    game_round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=True, index=True)
    attempt_type = Column(ENUM(AttemptType), nullable=False, default=AttemptType.PASS, index=True)
    achievement = Column(Boolean, index=True, nullable=False)
    test_cases = Column(PickleType)
    comment = Column(TEXT, index=True)
    comment_score = Column(Float, nullable=True, index=True)
    comment_score_count = Column(Integer, nullable=True, index=True)

    user = relationship("User", back_populates="attempts", cascade="all")
    challenge = relationship("Challenge", back_populates="attempts", cascade="all")
    game_rounds = relationship("GameRound", back_populates="attempts", cascade="all")
    attempt_scores = relationship("AttemptScore", back_populates="attempts", cascade="all")

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
    room_owner = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    player_1_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    player_2_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    player_3_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_state = Column(ENUM(GameState), index=True)
    game_over = Column(Boolean, default=False, index=True)
    game_winner_1_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_winner_2_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_winner_3_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    game_logs = relationship("GameLog", back_populates="game_rooms", cascade="all")
    game_rounds = relationship("GameRound", back_populates="game_rooms", cascade="all")
    winner_1 = relationship("User", back_populates="game_winner_1", foreign_keys="GameRoom.game_winner_1_id", cascade="all")
    winner_2 = relationship("User", back_populates="game_winner_2", foreign_keys="GameRoom.game_winner_2_id", cascade="all")
    winner_3 = relationship("User", back_populates="game_winner_3", foreign_keys="GameRoom.game_winner_3_id", cascade="all")
    player_1 = relationship("User", back_populates="first_player", foreign_keys="GameRoom.player_1_id", cascade="all")
    player_2 = relationship("User", back_populates="second_player", foreign_keys="GameRoom.player_2_id", cascade="all")
    player_3 = relationship("User", back_populates="third_player", foreign_keys="GameRoom.player_3_id", cascade="all")

class GameLog(Base):
    __tablename__ = "game_logs"

    id = Column(Integer, primary_key=True)
    message = Column(ENUM(GameMessage), index=True)
    game_room_id = Column(Integer, ForeignKey("game_rooms.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    game_round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=True, index=True)

    game_rooms = relationship("GameRoom", back_populates="game_logs")
    users = relationship("User", back_populates="game_logs", cascade="all")
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
    all_passed = Column(Boolean, default=False, index=True)
    first_chosen = Column(Integer, nullable=False, index=True)

    game_rooms = relationship("GameRoom", back_populates="game_rounds", cascade="all")
    users = relationship("User", back_populates="game_rounds", cascade="all")
    game_logs = relationship("GameLog", back_populates="game_rounds", cascade="all")
    attempts = relationship("Attempt", back_populates="game_rounds", cascade="all")

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

    attempts = relationship("Attempt", back_populates="attempt_scores", cascade="all")
    users = relationship("User", back_populates="attempt_scores", cascade="all")
    challenges = relationship("Challenge", back_populates="attempt_scores", cascade="all")

class GeneralAchievement(Base):
    __tablename__ = "general_achievements"

    id = Column(Integer, primary_key=True)
    name = Column(TEXT, index=True, nullable=False)
    description = Column(TEXT, index=True, nullable=False)
    hint = Column(TEXT, index=True, nullable=False)

    user_general_achievements = relationship("UserGeneralAchievement", back_populates="general_achievements")

class UserGeneralAchievement(Base):
    __tablename__ = "user_general_achievements"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    general_achievement_id = Column(Integer, ForeignKey("general_achievements.id"), nullable=False, index=True)

    users = relationship("User", back_populates="general_achievements", cascade="all")
    general_achievements = relationship("GeneralAchievement", back_populates="user_general_achievements")