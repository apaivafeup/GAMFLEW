from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    attempts = relationship("Attempt", back_populates="user")
    challenges = relationship("Challenge", back_populates="user")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    hint = Column(String, index=True)
    objective = Column(String, index=True)
    count = Column(Integer, index=True)
    timer = Column(Integer, index=True)
    board = Column(String, index=True)
    code_file = Column(String, index=True)
    submit_function = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("users.id"))
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    time_elapsed = Column(Integer, index=True)
    score = Column(Integer, index=True)
