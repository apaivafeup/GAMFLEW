from sqlalchemy.orm import Session

import schemas

def get_user(db: Session, user_id: int):
    return db.query(schemas.User).filter(schemas.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(schemas.User).filter(schemas.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 500):
    return db.query(schemas.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.User):
    print(user)
    db_user = schemas.User(
        name=user.name,
        email=user.email,
        password=user.password  # You may want to hash the password here
    )
    print(db_user)
    db.add(db_user)
    db.commit()
    return db_user

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = schemas.Challenge(
        name = challenge.name,
        hint = challenge.hint,
        objective = challenge.objective,
        count = challenge.count,
        timer = challenge.timer,
        board = challenge.board,
        code_file = challenge.code_file,
        submit_function = challenge.submit_function,
        owner_id = challenge.owner_id
    )
    db.add(db_challenge)
    db.commit()
    return db_challenge

def create_attempt(db: Session, attempt: schemas.Attempt):
    db_attempt = schemas.Attempt(
        time_elapsed = attempt.time_elapsed,
        score = attempt.score,
        player_id = attempt.player_id,
        challenge_id = attempt.challenge_id,
        attempt_type = attempt.attempt_type, #attempt.pass or attempt.fail
        comment = attempt.comment
    )
    db.add(db_attempt)
    db.commit()
    return db_attempt

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Challenge).offset(skip).limit(limit).all()

def get_challenge(db: Session, challenge_id: int):
    return db.query(schemas.Challenge).filter(schemas.Challenge.id == challenge_id).first()

def create_user_challenge(db: Session, challenge: schemas.Challenge, user_id: int):
    db_challenge = schemas.Challenge(**challenge.model_dump(), owner_id=user_id)
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
