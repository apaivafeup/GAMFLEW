import datetime
from sqlalchemy.orm import Session
from dateutil.relativedelta import *

import sys, os
sys.path.append(os.path.abspath(os.path.join('../', 'backend')))

import schemas

def at_least_one_month_after(token_date):
    current_date = datetime.datetime.now()

    # Calculate the difference in months
    months_difference = (
        (current_date.year - token_date.year) * 12 +
        current_date.month - token_date.month
    )

    return months_difference >= 1

def get_blacklisted_token(db: Session, token_id: int):
    return db.query(schemas.Token).filter(schemas.Token.id == token_id).first()

def get_blacklisted_tokens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Token).offset(skip).limit(limit).all()

def add_blacklisted_token(db: Session, token: str):
    expiration_date = datetime.datetime.now() + relativedelta(weeks=+1)
    db_token = schemas.Token(token=token, date=expiration_date)
    db.add(db_token)
    db.commit()
    return db_token

def get_expired_blacklisted_tokens(db: Session):
    current_date = datetime.datetime.now()
    expired_tokens = db.query(schemas.Token).filter(
        schemas.Token.date <= current_date).all()
    return expired_tokens

def delete_blacklisted_token(db: Session, token_id: int):
    token_to_delete = get_blacklisted_token(db, token_id)
    if token_to_delete is None:
        return None
    db.delete(token_to_delete)
    db.commit()
    return token_to_delete