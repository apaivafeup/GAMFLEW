from sqlalchemy.orm import Session
from dateutil.relativedelta import *

import random
import schemas

def get_challenge_titles(db: Session):
    challenges = db.query(schemas.Challenge).all()
    result = {}

    for challenge in challenges:
        result[challenge.id] = challenge.name

    return result

def create_user_challenge(db: Session, challenge: schemas.Challenge, user_id: int):
    db_challenge = schemas.Challenge(
        **challenge.model_dump(), owner_id=user_id)
    db.add(db_challenge)
    db.commit()
    return db_challenge

def get_challenge(db: Session, challenge_id: int):
    return db.query(schemas.Challenge).filter(schemas.Challenge.id == challenge_id).first()


def get_random_challenge(db: Session, game_room_id: int):
    challenge_count = int(db.query(schemas.Challenge).count())
    random_id = random.randint(1, challenge_count)
    random_challenge = db.query(schemas.Challenge).filter(
        schemas.Challenge.id == random_id).first()

    game_rounds = db.query(schemas.GameRound).filter(
        schemas.GameRound.game_room_id == game_room_id).all()

    if (len(game_rounds) == 0):
        return random_challenge

    for round in game_rounds:
        if round.challenge_id == random_challenge.id:
            return get_random_challenge(db, game_room_id)
        else:
            continue

    return random_challenge

def get_challenges_by_code(db: Session):
    challenges = db.query(schemas.Challenge).order_by(
        schemas.Challenge.code_file).all()

    code_file = ''
    challenges_by_code = {}
    for v in challenges:
        if (code_file != v.code_file):
            code_file = v.code_file
            challenges_by_code[code_file] = []

        challenges_by_code[code_file].append(v)

    return challenges_by_code

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = schemas.Challenge(
        name=challenge.name,
        hint=challenge.hint,
        objective=challenge.objective,
        test_cases_count=challenge.test_cases_count,
        score=challenge.score,
        initial_board=challenge.initial_board,
        code_file=challenge.code_file,
        challenge_type=challenge.challenge_type,
        passing_criteria=challenge.passing_criteria,
        achievement=challenge.achievement,
        achievement_hint=challenge.achievement_hint,
        owner_id=challenge.owner_id,
        difficulty=challenge.difficulty
    )
    db.add(db_challenge)
    db.commit()
    return db_challenge

def update_challenge(db: Session, challenge_id: int, challenge: schemas.Challenge):
    db_challenge = db.query(schemas.Challenge).filter(
        schemas.Challenge.id == challenge_id).first()

    if db_challenge is None:
        return None

    db_challenge.name = challenge.name
    db_challenge.hint = challenge.hint
    db_challenge.objective = challenge.objective
    db_challenge.test_cases_count = challenge.test_cases_count
    db_challenge.score = challenge.score
    db_challenge.initial_board = challenge.initial_board
    db_challenge.code_file = challenge.code_file
    db_challenge.challenge_type = challenge.challenge_type
    db_challenge.passing_criteria = challenge.passing_criteria
    db_challenge.achievement = challenge.achievement
    db_challenge.owner_id = challenge.owner_id
    db_challenge.difficulty = challenge.difficulty

    db.commit()
    return db_challenge

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Challenge).offset(skip).limit(limit).all()

def get_challenge_titles(db: Session):
    challenges = db.query(schemas.Challenge).all()
    result = {}

    for challenge in challenges:
        result[challenge.id] = challenge.name

    return result