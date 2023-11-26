import json
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

import schemas
import models


def get_user_basics(db: Session, user_id: int):
    user = db.query(schemas.User).filter(schemas.User.id == user_id).first()

    user_basics = models.UserBasics(
        id=user.id,
        name=user.name,
        email=user.email,
        failed_attempts=user.failed_attempts,
        successful_attempts=user.successful_attempts,
        score=user.score,
        achievements=user.achievements
    )

    return user_basics

def get_user(db: Session, user_id: int):
    return db.query(schemas.User).filter(schemas.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    user = db.query(schemas.User).filter(schemas.User.email == email).first()

    user_basics = models.UserBasics(
        id=user.id,
        name=user.name,
        email=user.email,
        failed_attempts=user.failed_attempts,
        successful_attempts=user.successful_attempts,
        score=user.score,
        achievements=user.achievements
    )

    return user_basics

def get_users(db: Session, skip: int = 0, limit: int = 500):
    users = db.query(schemas.User).offset(skip).limit(limit).all()

    user_basics = []
    for user in users:
        user_basics_inst = models.UserBasics(
            id=user.id,
            name=user.name,
            email=user.email,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            score=user.score,
            achievements=user.achievements
        )
        user_basics.append(user_basics_inst)

    return user_basics

def create_user(db: Session, user: schemas.User):
    db_user = schemas.User(
        name=user.name,
        email=user.email,
        password=user.password,  # You may want to hash the password here
        failed_attempts=0,
        successful_attempts=0,
        score=0,
        achievements=0
    )
    db.add(db_user)
    db.commit()
    return db_user

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = schemas.Challenge(
        name=challenge.name,
        hint=challenge.hint,
        objective=challenge.objective,
        count=challenge.count,
        timer=challenge.timer,
        board=challenge.board,
        code_file=challenge.code_file,
        passing_criteria=challenge.passing_criteria,
        owner_id=challenge.owner_id
    )
    db.add(db_challenge)
    db.commit()
    return db_challenge

def create_attempt(db: Session, attempt: schemas.Attempt):
    db_attempt = schemas.Attempt(
        time_elapsed=attempt.time_elapsed,
        score=attempt.score,
        player_id=attempt.player_id,
        challenge_id=attempt.challenge_id,
        attempt_type=attempt.attempt_type,  # attempt.pass or attempt.fail
        comment=attempt.comment
    )

    db.add(db_attempt)
    db.commit() # Save create attempt to db
    return db_attempt


def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Challenge).offset(skip).limit(limit).all()


def get_challenge(db: Session, challenge_id: int):
    return db.query(schemas.Challenge).filter(schemas.Challenge.id == challenge_id).first()


def create_user_challenge(db: Session, challenge: schemas.Challenge, user_id: int):
    db_challenge = schemas.Challenge(
        **challenge.model_dump(), owner_id=user_id)
    db.add(db_challenge)
    db.commit()
    return db_challenge


def delete_user(db: Session, user_id: int):
    user_to_delete = get_user(db, user_id)
    if user_to_delete is None:
        return None
    db.delete(user_to_delete)
    db.commit()
    return user_to_delete


def get_user_score(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user is None:
        return None

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass")
    user_score = 0
    for attempt in successful_attempts:
        user_score += attempt.score

    return user_score


def update_user(db: Session, user_id: int):
    user_to_update = get_user(db, user_id)
    if user_to_update is None:
        return None

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass").count()
    failed_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "fail").count()
    score = get_user_score(db, user_id)
    # TODO: Add achievements

    user_to_update.successful_attempts = successful_attempts
    user_to_update.failed_attempts = failed_attempts
    user_to_update.score = score

    db.commit()

    return user_to_update
