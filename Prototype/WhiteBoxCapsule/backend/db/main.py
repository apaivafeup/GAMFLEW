from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db_op import init_db, get_db
from jose import JWTError, jwt
from fastapi.responses import JSONResponse

# New stuff
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta # you might prefer not to have this, it's for the token to have a time limit so it also functions as a logout
from typing import Annotated

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

# their post/token will be your login
# doesn't work in docs, you have to change the endpoint to /token
@app.post('/login')
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.login(db=db, username=form_data.username, password=form_data.password)

    if user is None:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)    
    access_token = auth.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    crud.update_user_auth(db, user.id, True)

    return models.Token(access_token=access_token, token_type="bearer")

async def get_current_user(db: Session = Depends(get_db), token: str =  Depends(auth.oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = models.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = auth.get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[models.User, Depends(get_current_user)]):
    if not current_user.auth:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/logout")
async def logout(db: Session = Depends(get_db), token: str = Depends(auth.oauth2_scheme), user: models.User = Depends(get_current_user)) :
    crud.update_user_auth(db, user.id, False)
    # Add the token to a blacklist?
    """
        try:
        # Decode the token to get the username
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if the token is already in the blacklist (do this with the db)
    if token in blacklisted_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has already been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Add the token to the blacklist -> add to db table

    # Update user status to be logged out?

    # Figure out how to periodically clean up expired tokens from the blacklist to avoid unnecessary storage consumption
    """

    return JSONResponse(
        content={"message": "Logout successful"},
        status_code=status.HTTP_200_OK,
    )

## Register (create user)
@app.post("/register", response_model=models.UserBasics)
def create_user(user: models.UserRegister, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail already registered.")
    
    return crud.create_user(db=db, user=user)

## Create Challenge
@app.post("/create/challenge", response_model=models.Challenge)
def create_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge: models.Challenge, db: Session = Depends(get_db)):
    return crud.create_challenge(db=db, challenge=challenge)

## Create Code File
@app.post("/create/code-file", response_model=models.CodeFile)
def create_code_file(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file: models.CodeFile, db: Session = Depends(get_db)):
    return crud.create_code_file(db=db, code_file=code_file)

## Create Attempt
@app.post("/create/attempt", response_model=models.Attempt)
def create_attempt(current_user: Annotated[models.User, Depends(get_current_active_user)], attempt: models.Attempt, db: Session = Depends(get_db)):
    create_attempt = crud.create_attempt(db=db, attempt=attempt)
    crud.update_user_stats(db, attempt.player_id)
    return create_attempt

## Create Board State
@app.post("/create/board-state", response_model=models.BoardState)
def create_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], board_state: models.BoardState, db: Session = Depends(get_db)):
    return crud.create_board_state(db=db, board_state=board_state)

## Get Users
@app.get("/users/", response_model=list[models.UserBasics])
def read_users(current_user: Annotated[models.User, Depends(get_current_active_user)], skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

## Get specific user
@app.get("/users/{user_id}", response_model=models.UserBasics)
def read_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_basics(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

## Get specific user's challenges
@app.post("/users/{user_id}/challenges/", response_model=models.Challenge)
def create_challenge_for_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, challenge: models.Challenge, db: Session = Depends(get_db)):
    return crud.create_user_challenge(db=db, challenge=challenge, user_id=user_id)

## Get challenges dictionary, where code file is the key.
@app.get("/challenges-by-code/")
def read_challenges_by_code(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    challenges = crud.get_challenges_by_code(db)
    return challenges

## Get code files.
@app.get("/code-files/", response_model=list[models.CodeFile])
def read_code_files(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    code_files = crud.get_code_files(db)
    return code_files

## Get specific code file
@app.get("/code-files/{code_file_id}", response_model=models.CodeFile)
def read_code_files(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file_id: int, db: Session = Depends(get_db)):
    code_files = crud.get_code_file(db, code_file_id)
    return code_files

@app.get("/board-states/", response_model=list[models.BoardState])
def read_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    board_state = crud.get_board_states(db)
    return board_state

@app.get("/board-states/{board_state_id}", response_model=models.BoardState)
def read_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], board_state_id: int, db: Session = Depends(get_db)):
    board_state = crud.get_board_state(db, board_state_id)
    return board_state

## Get challenges
@app.get("/challenges/", response_model=list[models.ChallengeBasics])
def read_challenges(current_user: Annotated[models.User, Depends(get_current_active_user)], skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    challenges = crud.get_challenges(db, skip=skip, limit=limit)
    return challenges

## Get specific challenge
@app.get("/challenges/{challenge_id}", response_model=models.Challenge)
def read_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, db: Session = Depends(get_db)):
    challenge = crud.get_challenge(db, challenge_id=challenge_id)
    return challenge

## Get passed challenges
@app.get("/users/{user_id}/passed-challenges/", response_model=list[int])
def read_passed_challenges(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    passed_challenges = crud.get_passed_challenges(db, user_id=user_id)
    return passed_challenges

## Delete specific user
@app.delete('/user/{user_id}', status_code=200)
def delete_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id:int, db: Session = Depends(get_db)):
    user_to_delete = crud.get_user(db=db, user_id=user_id)
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="Resource Not Found")
    
    crud.delete_user(db=db, user_id=user_id)
    return user_to_delete


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
    #uvicorn.run(app, host="10.227.242.121", port=8000)