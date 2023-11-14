from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
import uvicorn

import crud, models, schemas
from db_op import init_db, get_db

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
#
init_db()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/create/user", response_model=models.User)
def create_user(user: models.User, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/create/challenge", response_model=models.Challenge)
def create_challenge(challenge: models.Challenge, db: Session = Depends(get_db)):
    return crud.create_challenge(db=db, challenge=challenge)

@app.post("/create/attempt", response_model=models.Attempt)
def create_attempt(attempt: models.Attempt, db: Session = Depends(get_db)):
    return crud.create_attempt(db=db, attempt=attempt)

@app.get("/users/", response_model=list[models.User])
def read_users(skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=models.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/challenges/", response_model=models.Challenge)
def create_challenge_for_user(
    user_id: int, challenge: models.Challenge, db: Session = Depends(get_db)
):
    return crud.create_user_challenge(db=db, challenge=challenge, user_id=user_id)

@app.get("/challenges/", response_model=list[models.Challenge])
def read_challenges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    challenges = crud.get_challenges(db, skip=skip, limit=limit)
    return challenges

@app.delete('/user/{user_id}', status_code=200)
def delete_user(user_id:int, db: Session = Depends(get_db)):
    user_to_delete = crud.get_user(db=db, user_id=user_id)
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="Resource Not Found")
    
    crud.delete_user(db=db, user_id=user_id)
    return user_to_delete

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)