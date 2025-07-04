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
import achievements

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
origins = ["http://frontend:5173", "http://backend:8000", "http://127.0.0.1:8000", "*"]


@app.api_route('/', methods=['GET', 'HEAD'])
def read_root():
    return {"Hello": "World"}



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:5473"],  # ← Must match exactly],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

#
init_db()

def cleanup_expired_tokens(db: Session):
    expired_tokens = crud.get_expired_blacklisted_tokens(db)

    for token in expired_tokens:
        crud.delete_blacklisted_token(db, token.id)

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
    
    db_user = crud.get_user_by_name(db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Name already registered.")
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail already registered.")
    
    return crud.create_user(db=db, user=user)


@app.post("/edit-user/{user_id}", response_model=models.UserResponse)
def edit_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user: models.UserRegister, user_id: int, db: Session = Depends(get_db)):
    if current_user.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    db_user = crud.get_user_by_id(db, user_id=user_id)  
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    
    return crud.edit_user(db=db, user_id=user_id, user=user)

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
    achievements.check_achievements(db, current_user.id)
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

## Get users
@app.post("/users/", response_model=list[models.UserBasics])
def read_users(current_user: Annotated[models.User, Depends(get_current_active_user)], user_ids: list[int], db: Session = Depends(get_db)):
    users = crud.get_users_by_id(db, user_ids=user_ids)
    if users is None:
        raise HTTPException(status_code=404, detail="User not found")
    return users

## Create specific user's challenges
@app.post("/users/{user_id}/challenges/", response_model=models.Challenge)
def create_challenge_for_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, challenge: models.Challenge, db: Session = Depends(get_db)):
    return crud.create_user_challenge(db=db, challenge=challenge, user_id=user_id)

## Get a user's unlocked general achievements
@app.get("/users/{user_id}/general-achievements/", response_model=list[int])
def get_general_achievements(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    ach = crud.get_user_general_achievements(db, user_id)
    return ach

## Get a user's unlocked challenge achievements
@app.get("/users/{user_id}/challenge-achievements/", response_model=list[int])
def get_user_challenge_achievements(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    ach = crud.get_user_challenge_achievements(db, user_id)
    return ach

## Get all general achievements
@app.get("/general-achievements/", response_model=list[models.GeneralAchievement])
def get_all_general_achievements(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    ach = crud.get_general_achievements(db)
    return ach

## Get challenges dictionary, where code file is the key.
@app.get("/challenges-by-code/")
def read_challenges_by_code(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    challenges = crud.get_challenges_by_code(db, user_type=current_user.user_type, user_id=current_user.id)
    return challenges

@app.get('/challenge-titles/')
def get_challenge_titles(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return crud.get_challenge_titles(db)

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
@app.get("/challenges/", response_model=list[models.Challenge])
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

## Get if challenge is passed
@app.get("/users/{user_id}/passed-challenges/{challenge_id}")
def read_passed_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, challenge_id: int, db: Session = Depends(get_db)):
    passed_challenge = crud.get_passed_challenge(db=db, user_id=user_id, challenge_id=challenge_id)
    return passed_challenge

## Get unlocked achievements (individual challenges)
@app.get("/users/{user_id}/achievements/challenges/", response_model=list[int])
def read_unlocked_challenge_achievements(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    unlocked_achievements = crud.get_unlocked_challenge_achievements(db, user_id=user_id)
    return unlocked_achievements

## Delete specific user
@app.delete('/user/{user_id}', status_code=200)
def delete_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id:int, db: Session = Depends(get_db)):
    user_to_delete = crud.get_user(db=db, user_id=user_id)
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="Resource Not Found")
    
    crud.delete_user(db=db, user_id=user_id)
    return user_to_delete

## Create game room
@app.post("/create/game-room", response_model=models.GameRoom)
def create_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room: models.CreateGameRoom, db: Session = Depends(get_db)):
    db_game_room = crud.create_game_room_api(db=db, game_room=game_room)
    return db_game_room

## Get game rooms
@app.get("/game-rooms/", response_model=list[models.GameRoom])
def read_game_rooms(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    game_rooms = crud.get_game_rooms(db)
    return game_rooms

## Get specific game room
@app.get("/game-room/{game_room_id}", response_model=models.GameRoom)
def read_game_rooms(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    if crud.is_in_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id):
        return crud.get_game_room(db, game_room_id=game_room_id)
    return HTTPException(status_code=401, detail="You cannot enter the room.")

## Enter game room
@app.post("/enter/game-room/{game_room_id}")
def enter_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    if crud.enter_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id) is None:
        return None
    return crud.send_enter_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)

## Leave game room
@app.post("/leave/game-room/{game_room_id}", response_model=models.GameLog)
def leave_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    crud.leave_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return crud.send_leave_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)

## Start game room
@app.post("/start/game-room/{game_room_id}", response_model=models.GameLog)
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_log = crud.send_start_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return game_log

@app.delete("/game-room/{game_room_id}")
def delete_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    crud.delete_game_room(db=db, game_room_id=game_room_id)
    return {"message": "Game room deleted"}

## Pass game round
@app.post("/game-room/{game_room_id}/game-round/{game_round_id}/pass")
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    can_pass = crud.can_pass_round(db, game_round_id, current_user.id)
    game_log = None
    if (can_pass):
        game_log = crud.send_pass_round_log(db=db, game_room_id=game_room_id, user_id=current_user.id, game_round_id=game_round_id)
        crud.pass_round(db=db, game_round_id=game_round_id)
    return game_log 

## Auto pass round.
@app.post("/game-room/{game_room_id}/game-round/{game_round_id}/auto-pass")
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    game_log = crud.send_pass_round_log(db=db, game_room_id=game_room_id, user_id=current_user.id, game_round_id=game_round_id, auto=True)
    crud.pass_round(db=db, game_round_id=game_round_id)
    return game_log 

@app.post("/game-room/{game_room_id}/game-round/{game_round_id}/can-pass")
def can_user_pass(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    return {"can_pass": crud.can_user_pass_round_auto(db=db, game_room_id=game_room_id, game_round_id=game_round_id)}

## Check game room state
@app.get("/game-room/{game_room_id}/state", response_model=models.GameRoomState)
def read_game_room_state(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return crud.set_game_room_state(db=db, game_room_id=game_room_id)

## Make round
@app.get("/game-room/{game_room_id}/round", response_model=models.GameRound)
def random_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    challenge = crud.get_random_challenge(db=db, game_room_id=game_room_id)
    #TODO: make pass the random challenge to the round creation.
    return crud.add_game_round(db=db, challenge_id=challenge.id, game_room_id=game_room_id)

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

## Finish game round (after all passed, from 1st chosen)
@app.post("/round/{game_round_id}/all-passed/finish", response_model=models.GameLog)
def finish_all_passed_game_round(current_user: Annotated[models.User, Depends(get_current_active_user)], game_round_id: int, db: Session = Depends(get_db)):
    game_round = crud.get_game_round(db, game_round_id)

    if (current_user.id == game_round.first_chosen):
        game_log = crud.send_next_round_log(db=db, game_round_id=game_round_id, user_id=current_user.id)
        crud.finish_all_passed_game_round(db=db, game_round_id=game_round_id)
    else:
        raise HTTPException(status_code=401, detail="Only the 1st chosen player can finish the round after a cycle of passes.")
    
    return game_log

## Reset game round (after all passed, from first chosen)
@app.post("/round/{game_round_id}/all-passed/reset", response_model=models.GameLog)
def reset_game_round(current_user: Annotated[models.User, Depends(get_current_active_user)], game_round_id: int, db: Session = Depends(get_db)):
    game_round = crud.get_game_round(db, game_round_id)

    if (current_user.id == game_round.first_chosen):
        game_log = crud.send_reset_round_log(db=db, game_round_id=game_round_id, user_id=current_user.id)
        crud.reset_game_round(db=db, game_round_id=game_round_id)
    else:
        raise HTTPException(status_code=401, detail="Only the 1st chosen player can finish the round after a cycle of passes.")
    
    return game_log

## Get round solution
@app.get("/game-room/{game_room_id}/round/{game_round_id}/solution")
def get_round_solution(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    return crud.get_round_solution(db=db, game_round_id=game_round_id)

## Send seen solution.
@app.post("/game-room/{game_room_id}/round/{game_round_id}/seen-solution", response_model=models.GameLog)
def seen_solution(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    return crud.send_seen_solution_log(db=db, game_round_id=game_round_id, user_id=current_user.id)

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

@app.get('/users/{user_id}/export', response_model=list[models.Attempt])
def export_user_attempts(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_attempts(db, user_id)

@app.get('/code-file-dictionary', response_model=dict)
def get_code_file_dictionary(db: Session = Depends(get_db)):
    return crud.get_code_file_dictionary(db)

@app.post('/admin/delete-user/{user_id}', response_model=models.UserBasics)
def validate_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    if current_user.user_type != schemas.UserType.ADMIN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return crud.delete_user(db, user_id)

@app.get('/challenges/{challenge_id}/comments', response_model=list[models.ChallengeComments])
def get_challenge_comments(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, db: Session = Depends(get_db)):
    return crud.get_passed_attempts_comments(db, challenge_id)

@app.post('/challenges/{challenge_id}/comments/{attempt_id}/score', response_model=models.AttemptScore)
def score_challenge_comment(current_user: Annotated[models.User, Depends(get_current_active_user)], attempt_score: models.AttemptScore, db: Session = Depends(get_db)):
    result = crud.create_attempt_score(db, user_id=current_user.id, attempt_id=attempt_score.attempt_id, given_score=attempt_score.given_score)
    return crud.add_comment_score(db, attempt_id=attempt_score.attempt_id, given_score=attempt_score.given_score) if result is not None else None

@app.get('/challenges/{challenge_id}/comments/scores/{user_id}', response_model=list[models.AttemptScore])
def get_user_attempt_scores(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_attempt_scores(db, challenge_id=challenge_id, user_id=user_id)

@app.get('/challenges/attempts/')
def get_all_attempts(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    if (current_user.user_type != schemas.UserType.PLAYER):
        return crud.get_all_attempts_by_challenge(db)
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get('/leaderboard/')
def get_leaderboard(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    if (current_user.user_type != schemas.UserType.PLAYER):
        return crud.get_admin_leaderboard(db)
    else:
        return crud.get_player_leaderboard(db)

@app.delete('/board-state/{board_state_id}', response_model=models.BoardState)
def delete_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], board_state_id: int, db: Session = Depends(get_db)):
    return crud.delete_board_state(db=db, board_state_id=board_state_id)

@app.delete('/code-file/{code_file_id}', response_model=models.CodeFile)
def delete_code_file(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file_id: int, db: Session = Depends(get_db)):
    if (current_user.user_type != schemas.UserType.ADMIN and code_file_id < 7):
        raise HTTPException(status_code=401, detail="Unauthorized.")
    return crud.delete_code_file(db=db, code_file_id=code_file_id)

@app.post('/update/code-file/{code_file_id}', response_model=models.CodeFile)
def update_code_file(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file_id: int, code_file: models.CodeFile, db: Session = Depends(get_db)):
    return crud.update_code_file(db=db, code_file_id=code_file_id, code_file=code_file)

@app.post('/update/board-state/{board_state_id}', response_model=models.BoardState)
def update_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], board_state_id: int, board_state: models.BoardState, db: Session = Depends(get_db)):
    return crud.update_board_state(db=db, board_state_id=board_state_id, board_state=board_state)

@app.delete('/challenge/{challenge_id}', response_model=models.Challenge)
def delete_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, db: Session = Depends(get_db)):
    return crud.delete_challenge(db=db, challenge_id=challenge_id)

@app.post('/student-class/{student_class_id}/challenge/{challenge_id}/visible')
def set_challenge_visibility(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, student_class_id: int, db: Session = Depends(get_db)):
    return crud.set_challenge_visibility(db=db, challenge_id=challenge_id, student_class_id=student_class_id)

@app.get('/student-classes/challenges/visibility')
def get_student_class_challenges_visibility(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return crud.get_student_class_challenge_visibility(db=db)

@app.post('/challenge/visible', response_model=models.Challenge)
def set_challenge_visibility(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_ids: list[int], db: Session = Depends(get_db)):
    return crud.set_challenge_visibility(db=db, challenge_ids=challenge_ids)

@app.post('/student-class/create', response_model=models.StudentClass)
def create_class(current_user: Annotated[models.User, Depends(get_current_active_user)], class_: models.StudentClass, db: Session = Depends(get_db)):
    if (current_user.user_type == schemas.UserType.PLAYER):
        raise HTTPException(status_code=401, detail="Unauthorized")

    student_class = crud.create_student_class(db=db, student_class=class_)
    crud.create_new_challenge_class(db, student_class=student_class)

    return student_class

@app.get('/student-class/', response_model=list[models.StudentClass])
def get_student_classes(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return crud.get_student_classes(db=db)

@app.post('/student-class/{class_id}/add-student/{user_id}', response_model=models.StudentClass)
def add_student_to_class(current_user: Annotated[models.User, Depends(get_current_active_user)], class_id: int, user_id: int, db: Session = Depends(get_db)):
    return crud.add_student_to_class(db=db, class_id=class_id, student_id=user_id)
                                     
@app.post('/student-class/{class_id}/remove-student/{user_id}', response_model=models.StudentClass)
def remove_student_from_class(current_user: Annotated[models.User, Depends(get_current_active_user)], class_id: int, user_id: int, db: Session = Depends(get_db)):
    return crud.remove_student_from_class(db=db, class_id=class_id, student_id=user_id)

@app.get('/student-class/{class_id}/challenge/{challenge_id}/visible', response_model=models.StudentClassChallenge)
def get_challenge_visibility(current_user: Annotated[models.User, Depends(get_current_active_user)], class_id: int, challenge_id: int, db: Session = Depends(get_db)):
    if class_id == -1 and current_user.user_type == "student":
        raise HTTPException(401, "Unauthorized - No Class")
    else:
        return crud.get_challenge_visibility(db=db, student_class_id=class_id, challenge_id=challenge_id)

@app.post('/student-class/{class_id}/delete', response_model=models.StudentClass)
def delete_student_class(current_user: Annotated[models.User, Depends(get_current_active_user)], class_id: int, db: Session = Depends(get_db)):
    return crud.delete_student_class(db=db, class_id=class_id)

@app.get('/student-class/{class_id}/students', response_model=list[models.UserBasics])
def get_students_in_class(current_user: Annotated[models.User, Depends(get_current_active_user)], class_id: int, db: Session = Depends(get_db)):
    return crud.get_students_in_class(db=db, class_id=class_id)

@app.get('/student-class/users')
def get_student_classes_by_user(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return crud.get_student_classes_by_user(db=db)

@app.post('/student-class/{class_id}/code-file/{code_file_id}/visible')
def set_code_file_visibility(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file_id: int, class_id: int, visibility: dict, db: Session = Depends(get_db)):
    return crud.set_code_file_visibility(db=db, code_file_id=code_file_id, student_class_id=class_id, visibility=visibility["visible"])

@app.get('/attempted-challenges/', response_model=list[int])
def get_attempted_challenges(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return crud.get_attempted_challenges(db, current_user.id)

@app.get('/code-files/visibility/')
def get_code_files_visibility(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return crud.get_code_files_visibility(db=db)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
    #uvicorn.run(app, host="10.227.242.121", port=8000, ssl_keyfile="./gamflew_api.key", ssl_certfile="./gamflew_api.pem")

