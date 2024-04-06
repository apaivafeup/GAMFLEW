from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db_op import init_db, get_db
from jose import JWTError, jwt
from fastapi.responses import JSONResponse
import shutil, os
from fastapi.staticfiles import StaticFiles
from fastapi import BackgroundTasks
import datetime
import ssl

# New stuff
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta # you might prefer not to have this, it's for the token to have a time limit so it also functions as a logout
from typing import Annotated

import uvicorn
import crud, models, schemas, auth

#ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
#ssl_context.load_cert_chain('./gamflew_api.pem', keyfile='./gamflew_api.key')

# Check if file directories exist, if not create them
if not os.path.exists('static'):
    os.mkdir('static')
if not os.path.exists('static/docs'):
    os.mkdir('static/docs')
if not os.path.exists('static/images'):
    os.mkdir('static/images')

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
app.mount("/static", StaticFiles(directory="static"), name="static")

#
init_db()

def cleanup_expired_tokens(db: Session):
    expired_tokens = crud.get_expired_blacklisted_tokens(db)

    for token in expired_tokens:
        crud.delete_blacklisted_token(db, token.id)

@app.api_route('/', methods=['GET', 'HEAD'])
def read_root():
    return {"Hello": "World"}

# their post/token will be your login
# doesn't work in docs, you have to change the endpoint to /token
@app.post('/login')
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.login(db=db, username=form_data.username, password=form_data.password)

    if user is None:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
        return
    
    blacklisted_tokens = crud.get_blacklisted_tokens(db)
    blacklisted_token_strings = [token_obj.token for token_obj in blacklisted_tokens]
    access_token = auth.create_access_token(data={"sub": user.username}, blacklisted_token_strings=blacklisted_token_strings)
    crud.update_user_auth(db, user.id, True)

    return models.Token(access_token=access_token, token_type="bearer", user_id=user.id)

async def get_current_user(db: Session = Depends(get_db), token: str =  Depends(auth.oauth2_scheme)):
    # Check if the token is expired + if it's in the blacklist
    blacklisted_tokens = crud.get_blacklisted_tokens(db)
    blacklisted_token_strings = [token_obj.token for token_obj in blacklisted_tokens]
    if token in blacklisted_token_strings:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has already been revoked",
            headers={"WWW-Authenticate": "Bearer"},
    )
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    credentials_expired = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail= "Expired Token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        date = payload.get("exp")

        current_time = datetime.datetime.now()
        if current_time >= datetime.datetime.fromtimestamp(date):
            raise credentials_expired
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
async def logout(background_tasks: BackgroundTasks, db: Session = Depends(get_db), token: str = Depends(auth.oauth2_scheme), user: models.User = Depends(get_current_user)) :    
    crud.update_user_auth(db, user.id, False)

    # Add the token to the blacklist -> add to db table
    crud.add_blacklisted_token(db, token=token)

    # Figure out how to periodically clean up expired tokens from the blacklist to avoid unnecessary storage consumption
    background_tasks.add_task(cleanup_expired_tokens, db)

    return JSONResponse(
        content={"message": "Logout successful"},
        status_code=status.HTTP_200_OK,
    )

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    filepath_images="./static/images/"
    # filepath_docs = "./static/docs/"
    filename = file.filename
    extension = filename.split(".")[-1] 

    if extension not in ("jpg", "jpeg", "png"): # "pdf", "gif", "doc", "docx", "rtf", "csv", "xls", "xlsx", "txt", "ppt", "pptx"
        raise HTTPException(status_code=400, detail="Invalid file extension")
    else:
        generated_name = filepath_images + filename

    # if extension in ("pdf", "gif", "doc", "docx", "rtf", "csv", "xls", "xlsx", "txt", "ppt", "pptx"):
    #     generated_name = filepath_docs + filename

    with open(generated_name, "wb") as f_test:
        shutil.copyfileobj(file.file, f_test)

    file_url = generated_name[1:]
    return {"status": "ok", "file_url": file_url}

## Register (create user)
@app.post("/register", response_model=models.UserResponse)
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

## Update Challenge
@app.post("/update/challenge/{challenge_id}", response_model=models.Challenge)
def update_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, challenge: models.Challenge, db: Session = Depends(get_db)):
    return crud.update_challenge(db=db, challenge_id=challenge_id, challenge=challenge)

## Create Code File
@app.post("/create/code-file", response_model=models.CodeFile)
def create_code_file(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file: models.CodeFile, db: Session = Depends(get_db)):
    return crud.create_code_file(db=db, code_file=code_file)

## Create Attempt
@app.post("/create/attempt", response_model=models.Attempt)
def create_attempt(current_user: Annotated[models.User, Depends(get_current_active_user)], attempt: models.Attempt, db: Session = Depends(get_db)):
    create_attempt = crud.create_attempt(db=db, attempt=attempt)
    crud.update_user_stats(db, current_user.id)
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

## Get specific users
@app.post("/users/", response_model=list[models.UserBasics])
def read_users(current_user: Annotated[models.User, Depends(get_current_active_user)], user_ids: list[int], db: Session = Depends(get_db)):
    users = crud.get_users_by_id(db, user_ids=user_ids)
    if users is None:
        raise HTTPException(status_code=404, detail="User not found")
    return users

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

## Create game room
@app.post("/create/game-room", response_model=models.GameLog)
def create_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room: int, db: Session = Depends(get_db)):
    db_game_room = crud.create_game_room(db=db, game_room=game_room)
    return crud.send_game_log(db=db, game_room_id=db_game_room.id, user_id=current_user.id, message=schemas.GameMessage.ENTER)

## Get game rooms
@app.get("/game-rooms/", response_model=list[models.GameRoom])
def read_game_rooms(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    game_rooms = crud.get_game_rooms(db)
    return game_rooms

## Get specific game room
@app.get("/game-room/{game_room_id}", response_model=models.GameRoom)
def read_game_rooms(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_room = crud.get_game_room(db, game_room_id=game_room_id)
    return game_room

## Enter game room
@app.post("/enter/game-room/{game_room_id}", response_model=models.GameLog)
def enter_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    crud.enter_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return crud.send_enter_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)

## Leave game room
@app.post("/leave/game-room/{game_room_id}", response_model=models.GameLog)
def leave_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    crud.leave_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return crud.send_leave_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id
                                    )
## Start game room
@app.post("/start/game-room/{game_room_id}", response_model=models.GameLog)
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_log = crud.send_start_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return game_log

## Check game room state
@app.get("/game-room/{game_room_id}/state", response_model=models.GameRoomState)
def read_game_room_state(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return crud.set_game_room_state(db=db, game_room_id=game_room_id)

## Make round
@app.get("/game-room/{game_room_id}/round", response_model=models.GameRound)
def random_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    challenge = crud.get_random_challenge(db=db, game_room_id=game_room_id)
    return crud.add_game_round(db=db, challenge_id=1, game_room_id=game_room_id)

## Start round
@app.post("/round/{game_round_id}/start", response_model=models.GameLog)
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_round_id: int, db: Session = Depends(get_db)):
    game_log = crud.send_start_game_log(db=db, game_round_id=game_round_id, user_id=current_user.id)
    return game_log

## Finish game round
@app.post("/round/{game_round_id}/finish", response_model=models.GameLog)
def finish_game_round(current_user: Annotated[models.User, Depends(get_current_active_user)], game_round_id: int, db: Session = Depends(get_db)):
    game_log = crud.send_next_round_log(db=db, game_round_id=game_round_id, user_id=current_user.id)
    crud.finish_game_round(db=db, game_round_id=game_round_id)
    return game_log

## Finish game room
@app.post("/finish/game-room/{game_room_id}", response_model=models.GameLog)
def finish_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_log = crud.send_finish_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)
    crud.finish_game_room(db=db, game_room_id=game_room_id)
    return game_log

## Get winner
@app.get("/game-room/{game_room_id}/winner", response_model=list[models.UserBasics])
def get_winner(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return crud.get_winner(db=db, game_room_id=game_room_id)

## Get game results
@app.get("/game-room/{game_room_id}/results", response_model=list[models.GameRoomSummary])
def get_game_results(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return crud.get_game_results(db=db, game_room_id=game_room_id)


@app.get('/code-file-dictionary', response_model=dict)
def get_code_file_dictionary(db: Session = Depends(get_db)):
    return crud.get_code_file_dictionary(db)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
    #uvicorn.run(app, host="10.227.242.121", port=8000, ssl_keyfile="./gamflew_api.key", ssl_certfile="./gamflew_api.pem")

