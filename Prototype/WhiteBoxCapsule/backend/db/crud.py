from sqlalchemy.orm import Session

import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 500):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.User):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = models.Challenge(challenge)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

def create_attempt(db: Session, attempt: schemas.Attempt):
    db_attempt = models.Attempt(attempt)
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Challenge).offset(skip).limit(limit).all()

def create_user_challenge(db: Session, challenge: schemas.Challenge, user_id: int):
    db_challenge = models.Challenge(**challenge.model_dump(), owner_id=user_id)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge
