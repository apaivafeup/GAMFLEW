from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    attempts = relationship("Attempt", back_populates="user")
    challenges = relationship("Challenge", back_populates="user")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    hint = Column(String, index=True)
    objective = Column(String, index=True)
    count = Column(Integer, index=True)
    timer = Column(Integer, index=True)
    board = Column(String, index=True, nullable=True)
    code_file = Column(String, index=True)
    submit_function = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="challenges")
    attempts = relationship("Attempt", back_populates="challenge")

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True)
    time_elapsed = Column(Integer, index=True)
    score = Column(Integer, index=True)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)

    user = relationship("User", back_populates="attempts")
    challenge = relationship("Challenge", back_populates="attempts")
