import json
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

import schemas
import models
import auth

def create_user(db: Session, user: schemas.User):
    hashed_password = auth.get_password_hash(user.password)
    db_user = schemas.User(
        name=user.name,
        username=user.username,
        password=hashed_password,
        user_type=user.user_type,  # You may want to hash the password here
        failed_attempts=0,
        successful_attempts=0,
        score=0,
        achievements=0,
        auth = True
    )
    db.add(db_user)
    db.commit()
    return db_user

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = schemas.Challenge(
        name=challenge.name,
        description=challenge.description,
        hint=challenge.hint,
        objective=challenge.objective,
        test_cases_count=challenge.test_cases_count,
        score=challenge.score,
        initial_board=challenge.initial_board,
        code_file=challenge.code_file,
        challenge_type=challenge.challenge_type,
        passing_criteria=challenge.passing_criteria,
        achievement_criteria=challenge.achievement_criteria,
        owner_id=challenge.owner_id,
        difficulty=challenge.difficulty
    )
    db.add(db_challenge)
    db.commit()
    return db_challenge

def create_code_file(db: Session, code_file: schemas.CodeFile):
    db_code_file = schemas.CodeFile(
        name=code_file.name,
        content=code_file.content,
        dictionary=code_file.dictionary
    )
    db.add(db_code_file)
    db.commit()
    return db_code_file

def create_board_state(db: Session, board_state: schemas.BoardState):
    db_board_state = schemas.BoardState(
        name=board_state.name,
        board_state=board_state.board_state,
        out_of_bounds_state=board_state.out_of_bounds_state
    )
    db.add(db_board_state)
    db.commit()
    return db_board_state

def create_attempt(db: Session, attempt: schemas.Attempt):
    db_attempt = schemas.Attempt(
        score=attempt.score,
        player_id=attempt.player_id,
        challenge_id=attempt.challenge_id,
        attempt_type=attempt.attempt_type,  # attempt.pass or attempt.fail
        comment=attempt.comment,
        test_cases=attempt.test_cases
    )

    db.add(db_attempt)
    db.commit() # Save create attempt to db
    return db_attempt

def get_user_basics(db: Session, user_id: int):
    user = db.query(schemas.User).filter(schemas.User.id == user_id).first()

    user_basics = models.UserBasics(
        id=user.id,
        name=user.name,
        username=user.username,
        failed_attempts=user.failed_attempts,
        successful_attempts=user.successful_attempts,
        score=user.score,
        achievements=user.achievements
    )

    return user_basics

def get_user(db: Session, user_id: int):
    return db.query(schemas.User).filter(schemas.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    user = db.query(schemas.User).filter(schemas.User.username == username).first()

    user_basics = models.UserBasics(
        id=user.id,
        name=user.name,
        username=user.username,
        user_type=user.user_type,
        failed_attempts=user.failed_attempts,
        successful_attempts=user.successful_attempts,
        score=user.score,
        achievements=user.achievements,
        auth=user.auth
    )

    return user_basics

def get_users(db: Session, skip: int = 0, limit: int = 500):
    users = db.query(schemas.User).offset(skip).limit(limit).all()

    user_basics = []
    for user in users:
        user_basics_inst = models.UserBasics(
            id=user.id,
            name=user.name,
            username=user.username,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            score=user.score,
            achievements=user.achievements
        )
        user_basics.append(user_basics_inst)

    return user_basics

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Challenge).offset(skip).limit(limit).all()

def get_challenges_by_code(db: Session):
    challenges = db.query(schemas.Challenge).order_by(schemas.Challenge.code_file).all()

    code_file = ''
    challenges_by_code = {}
    for v in challenges:
        if (code_file != v.code_file):
            code_file = v.code_file
            challenges_by_code[code_file] = []
        
        challenges_by_code[code_file].append(v)
    
    return challenges_by_code

def get_code_files(db: Session):
    return db.query(schemas.CodeFile).all()

def get_code_file(db: Session, code_file_id: int):
    return db.query(schemas.CodeFile).filter(schemas.CodeFile.id == code_file_id).first()

def get_challenge(db: Session, challenge_id: int):
    return db.query(schemas.Challenge).filter(schemas.Challenge.id == challenge_id).first()

def get_board_states(db: Session):
    return db.query(schemas.BoardState).all()

def get_board_state(db: Session, board_state_id: int):
    return db.query(schemas.BoardState).filter(schemas.BoardState.id == board_state_id).first()

def create_user_challenge(db: Session, challenge: schemas.Challenge, user_id: int):
    db_challenge = schemas.Challenge(
        **challenge.model_dump(), owner_id=user_id)
    db.add(db_challenge)
    db.commit()
    return db_challenge

def get_passed_challenges(db: Session, user_id: int):
    passed_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass")
    passed_challenges_ids = [attempt.challenge_id for attempt in passed_attempts]
    return passed_challenges_ids

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
    
    covered_challenges = get_passed_challenges(db, user_id) # Get all challenges that the user has passed, to help in finding the highscores.

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass")

    user_score = 0
    for challenge_id in covered_challenges:
        attempts = successful_attempts.filter(schemas.Attempt.challenge_id == challenge_id)

        attempts.order_by(schemas.Attempt.score.desc())

        user_score += attempts[0].score ## Only count the highest-scored attempt for each challenge.

    return user_score

def update_user_stats(db: Session, user_id: int):
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

def update_user_auth(db: Session, user_id: int, auth: bool):
    user_to_update = get_user(db, user_id)
    if user_to_update is None:
        return None

    user_to_update.auth = auth

    db.commit()

    return user_to_update
