from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import schemas

# to get a string like this run: openssl rand -hex 32
SECRET_KEY = "daf4160d13aab760e4059bcf9089cb9b77e10cac9bafe4234612848f3515a9db"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def login(db: Session, user: schemas.User):
    db_user = db.query(schemas.User).filter(
        schemas.User.email == user.email).first()
    if not user:
        return False
    if not verify_password(user.password, db_user.password):
        return False
    return user
