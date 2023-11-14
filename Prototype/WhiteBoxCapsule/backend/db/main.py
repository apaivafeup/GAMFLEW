from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/create/user", response_model=schemas.User)
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/create/challenge", response_model=schemas.Challenge)
def create_challenge(challenge: schemas.Challenge, db: Session = Depends(get_db)):
    return crud.create_challenge(db=db, challenge=challenge)

@app.post("/create/attempt", response_model=schemas.Attempt)
def create_attempt(attempt: schemas.Attempt, db: Session = Depends(get_db)):
    return crud.create_attempt(db=db, attempt=attempt)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/challenges/", response_model=schemas.Challenge)
def create_challenge_for_user(
    user_id: int, challenge: schemas.Challenge, db: Session = Depends(get_db)
):
    return crud.create_user_challenge(db=db, challenge=challenge, user_id=user_id)

@app.get("/challenges/", response_model=list[schemas.Challenge])
def read_challenges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    challenges = crud.get_challenges(db, skip=skip, limit=limit)
    return challenges
