from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone # you might prefer not to have this, it's for the token to have a time limit so it also functions as a logout

import models, schemas

# to get a string like this run: openssl rand -hex 32
SECRET_KEY = "daf4160d13aab760e4059bcf9089cb9b77e10cac9bafe4234612848f3515a9db"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(db: Session, username: str):
    try:
        user = db.query(schemas.User).filter(schemas.User.username == username).first()
    except:
        return None

    if user is not None:
        return user

    return None
    
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def login(db: Session, username: str, password: str):
    user = get_user(db, username)
    if user is None or user.validated == False:
        return False
    
    if not verify_password(password, user.password) :
        return False
    
    return user

def create_access_token(data: dict, blacklisted_token_strings: List[str]):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    while True:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        if encoded_jwt not in blacklisted_token_strings:
            return encoded_jwt
