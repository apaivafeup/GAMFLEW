from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db_op import init_db, get_db

import uvicorn
import crud, models, schemas, auth



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

@AuthJWT.load_config
def get_config():
    return models.Settings() # I think the issue is here, not what you deleted

@app.post('/login')
def login(user: models.UserLogin, Authorize: AuthJWT = Depends()):
    if auth.login(user):
        access_token = Authorize.create_access_token(subject=user.email)
        refresh_token = Authorize.create_refresh_token(subject=user.email)
        return {"access_token": access_token, "refresh_token": refresh_token}
    raise HTTPException(status_code=401, detail="Invalid email or password.")

@app.get('/protected')
def get_logged_in_user(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
    
    current_user = Authorize.get_jwt_subject()
    return {"current_user": current_user}

@app.post('/refresh')
def refresh(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_refresh_token_required()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")
    
    current_user = Authorize.get_jwt_subject()
    access_token = Authorize.create_access_token(subject=current_user)

    return {"access_token": access_token}

@app.post('/logout')
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    Authorize.jwt_refresh_token_required()
    Authorize.jwt_blacklist.add(Authorize.get_raw_jwt()['jti'])
    return {"message": "Successfully logged out."}

## Create User
@app.post("/create/user", response_model=models.User)
def create_user(user: models.User, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

## Create Challenge
@app.post("/create/challenge", response_model=models.Challenge)
def create_challenge(challenge: models.Challenge, db: Session = Depends(get_db)):
    return crud.create_challenge(db=db, challenge=challenge)

## Create Code File
@app.post("/create/code-file", response_model=models.CodeFile)
def create_code_file(code_file: models.CodeFile, db: Session = Depends(get_db)):
    return crud.create_code_file(db=db, code_file=code_file)

## Create Attempt
@app.post("/create/attempt", response_model=models.Attempt)
def create_attempt(attempt: models.Attempt, db: Session = Depends(get_db)):
    create_attempt = crud.create_attempt(db=db, attempt=attempt)
    crud.update_user_stats(db, attempt.player_id)
    return create_attempt

## Create Board State
@app.post("/create/board-state", response_model=models.BoardState)
def create_board_state(board_state: models.BoardState, db: Session = Depends(get_db)):
    return crud.create_board_state(db=db, board_state=board_state)

## Get Users
@app.get("/users/", response_model=list[models.UserBasics])
def read_users(skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

## Get specific user
@app.get("/users/{user_id}", response_model=models.UserBasics)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_basics(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

## Get specific user's challenges
@app.post("/users/{user_id}/challenges/", response_model=models.Challenge)
def create_challenge_for_user(
    user_id: int, challenge: models.Challenge, db: Session = Depends(get_db)
):
    return crud.create_user_challenge(db=db, challenge=challenge, user_id=user_id)

## Get challenges dictionary, where code file is the key.
@app.get("/challenges-by-code/")
def read_challenges_by_code(db: Session = Depends(get_db)):
    challenges = crud.get_challenges_by_code(db)
    return challenges

## Get code files.
@app.get("/code-files/", response_model=list[models.CodeFile])
def read_code_files(db: Session = Depends(get_db)):
    code_files = crud.get_code_files(db)
    return code_files

## Get specific code file
@app.get("/code-files/{code_file_id}", response_model=models.CodeFile)
def read_code_files(code_file_id: int, db: Session = Depends(get_db)):
    code_files = crud.get_code_file(db, code_file_id)
    return code_files

@app.get("/board-states/", response_model=list[models.BoardState])
def read_board_state(db: Session = Depends(get_db)):
    board_state = crud.get_board_states(db)
    return board_state

@app.get("/board-states/{board_state_id}", response_model=models.BoardState)
def read_board_state(board_state_id: int, db: Session = Depends(get_db)):
    board_state = crud.get_board_state(db, board_state_id)
    return board_state

## Get challenges
@app.get("/challenges/", response_model=list[models.ChallengeBasics])
def read_challenges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    challenges = crud.get_challenges(db, skip=skip, limit=limit)
    return challenges

## Get specific challenge
@app.get("/challenges/{challenge_id}", response_model=models.Challenge)
def read_challenge(challenge_id: int, db: Session = Depends(get_db)):
    challenge = crud.get_challenge(db, challenge_id=challenge_id)
    return challenge

## Get passed challenges
@app.get("/users/{user_id}/passed-challenges/", response_model=list[int])
def read_passed_challenges(user_id: int, db: Session = Depends(get_db)):
    passed_challenges = crud.get_passed_challenges(db, user_id=user_id)
    return passed_challenges

## Delete specific user
@app.delete('/user/{user_id}', status_code=200)
def delete_user(user_id:int, db: Session = Depends(get_db)):
    user_to_delete = crud.get_user(db=db, user_id=user_id)
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="Resource Not Found")
    
    crud.delete_user(db=db, user_id=user_id)
    return user_to_delete


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
    #uvicorn.run(app, host="10.227.242.121", port=8000)