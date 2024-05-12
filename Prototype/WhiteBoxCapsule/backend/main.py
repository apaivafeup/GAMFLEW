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
import crud.token as token, crud.board_state as board_state, crud.code_file as code_file, crud.code_file_dictionary as code_file_dictionary
import crud.challenge as challenge, crud.attempt as attempt, crud.game_room as game_room, crud.game_round as game_round, crud.user as user
import crud.leaderboard as leaderboard
import crud.game_log as game_log
import models
import schemas
import auth

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
    expired_tokens = token.get_expired_blacklisted_tokens(db)

    for token in expired_tokens:
        token.delete_blacklisted_token(db, token.id)

@app.api_route('/', methods=['GET', 'HEAD'])
def read_root():
    return {"Hello": "World"}

# their post/token will be your login
# doesn't work in docs, you have to change the endpoint to /token
@app.post('/login')
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = auth.login(db=db, username=form_data.username, password=form_data.password)

    if db_user is None:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
        return
    
    blacklisted_tokens = token.get_blacklisted_tokens(db)
    blacklisted_token_strings = [token_obj.token for token_obj in blacklisted_tokens]
    access_token = auth.create_access_token(data={"sub": db_user.username}, blacklisted_token_strings=blacklisted_token_strings)
    user.update_user_auth(db, db_user.id, True)

    return models.Token(access_token=access_token, token_type="bearer", user_id=db_user.id)

async def get_current_user(db: Session = Depends(get_db), db_token: str =  Depends(auth.oauth2_scheme)):
    # Check if the token is expired + if it's in the blacklist
    blacklisted_tokens = token.get_blacklisted_tokens(db)
    blacklisted_token_strings = [token_obj.token for token_obj in blacklisted_tokens]
    if db_token in blacklisted_token_strings:
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
        payload = jwt.decode(db_token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
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
    db_user = auth.get_user(db, username=token_data.username)
    if db_user is None:
        raise credentials_exception
    return db_user

async def get_current_active_user(current_user: Annotated[models.User, Depends(get_current_user)]):
    if not current_user.auth:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/logout")
async def logout(background_tasks: BackgroundTasks, db: Session = Depends(get_db), db_token: str = Depends(auth.oauth2_scheme), db_user: models.User = Depends(get_current_user)) :    
    db_user.update_user_auth(db, db_user.id, False)

    # Add the token to the blacklist -> add to db table
    token.add_blacklisted_token(db, token=db_token)

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
def create_user(new_user: models.UserRegister, db: Session = Depends(get_db)):
    db_user = user.get_user_by_username(db, username=new_user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    db_user = user.get_user_by_email(db, email=new_user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail already registered.")
    
    return user.create_user(db=db, user=new_user)


@app.post("/edit-user/{user_id}", response_model=models.UserResponse)
def edit_user(current_user: Annotated[models.User, Depends(get_current_active_user)], edit_user: models.UserRegister, user_id: int, db: Session = Depends(get_db)):
    if current_user.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    db_user = user.get_user_by_id(db, user_id=user_id)  
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    
    return user.edit_user(db=db, user_id=user_id, user=edit_user)

## Create Challenge
@app.post("/create/challenge", response_model=models.Challenge)
def create_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], new_challenge: models.Challenge, db: Session = Depends(get_db)):
    return challenge.create_challenge(db=db, challenge=new_challenge)

## Update Challenge
@app.post("/update/challenge/{challenge_id}", response_model=models.Challenge)
def update_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, new_challenge: models.Challenge, db: Session = Depends(get_db)):
    return challenge.update_challenge(db=db, challenge_id=challenge_id, challenge=new_challenge)

## Create Code File
@app.post("/create/code-file", response_model=models.CodeFile)
def create_code_file(current_user: Annotated[models.User, Depends(get_current_active_user)], new_code_file: models.CodeFile, db: Session = Depends(get_db)):
    return challenge.create_code_file(db=db, code_file=new_code_file)

## Create Attempt
@app.post("/create/attempt", response_model=models.Attempt)
def create_attempt(current_user: Annotated[models.User, Depends(get_current_active_user)], new_attempt: models.Attempt, db: Session = Depends(get_db)):
    create_attempt = attempt.create_attempt(db=db, attempt=new_attempt)
    user.update_user_stats(db, current_user.id)
    return create_attempt

## Create Board State
@app.post("/create/board-state", response_model=models.BoardState)
def create_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], new_board_state: models.BoardState, db: Session = Depends(get_db)):
    return board_state.create_board_state(db=db, board_state=new_board_state)

## Get Users
@app.get("/users/", response_model=list[models.UserBasics])
def read_users(current_user: Annotated[models.User, Depends(get_current_active_user)], skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    users = user.get_users(db, skip=skip, limit=limit)
    return users

## Get specific user
@app.get("/users/{user_id}", response_model=models.UserBasics)
def read_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    db_user = user.get_user_basics(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

## Get users
@app.post("/users/", response_model=list[models.UserBasics])
def read_users(current_user: Annotated[models.User, Depends(get_current_active_user)], user_ids: list[int], db: Session = Depends(get_db)):
    users = user.get_users_by_id(db, user_ids=user_ids)
    if users is None:
        raise HTTPException(status_code=404, detail="User not found")
    return users

## Get specific user's challenges
@app.post("/users/{user_id}/challenges/", response_model=models.Challenge)
def create_challenge_for_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, new_challenge: models.Challenge, db: Session = Depends(get_db)):
    return challenge.create_user_challenge(db=db, challenge=new_challenge, user_id=user_id)

## Get challenges dictionary, where code file is the key.
@app.get("/challenges-by-code/")
def read_challenges_by_code(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    challenges = challenge.get_challenges_by_code(db)
    return challenges

@app.get('/challenge-titles/')
def get_challenge_titles(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    return challenge.get_challenge_titles(db)

## Get code files.
@app.get("/code-files/", response_model=list[models.CodeFile])
def read_code_files(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    code_files = code_file.get_code_files(db)
    return code_files

## Get specific code file
@app.get("/code-files/{code_file_id}", response_model=models.CodeFile)
def read_code_files(current_user: Annotated[models.User, Depends(get_current_active_user)], code_file_id: int, db: Session = Depends(get_db)):
    code_files = code_file.get_code_file(db, code_file_id)
    return code_files

@app.get("/board-states/", response_model=list[models.BoardState])
def read_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    board_states = board_state.get_board_states(db)
    return board_states

@app.get("/board-states/{board_state_id}", response_model=models.BoardState)
def read_board_state(current_user: Annotated[models.User, Depends(get_current_active_user)], board_state_id: int, db: Session = Depends(get_db)):
    db_board_state = board_state.get_board_state(db, board_state_id)
    return db_board_state

## Get challenges
@app.get("/challenges/", response_model=list[models.Challenge])
def read_challenges(current_user: Annotated[models.User, Depends(get_current_active_user)], skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    challenges = challenge.get_challenges(db, skip=skip, limit=limit)
    return challenges

## Get specific challenge
@app.get("/challenges/{challenge_id}", response_model=models.Challenge)
def read_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, db: Session = Depends(get_db)):
    db_challenge = challenge.get_challenge(db, challenge_id=challenge_id)
    return db_challenge

## Get passed challenges
@app.get("/users/{user_id}/passed-challenges/", response_model=list[int])
def read_passed_challenges(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    passed_challenges = attempt.get_passed_challenges(db, user_id=user_id)
    return passed_challenges

## Get unlocked achievements (individual challenges)
@app.get("/users/{user_id}/achievements/challenges/", response_model=list[int])
def read_unlocked_challenge_achievements(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    unlocked_achievements = attempt.get_unlocked_challenge_achievements(db, user_id=user_id)
    return unlocked_achievements

## Delete specific user
@app.delete('/user/{user_id}', status_code=200)
def delete_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id:int, db: Session = Depends(get_db)):
    user_to_delete = user.get_user(db=db, user_id=user_id)
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="Resource Not Found")
    
    user.delete_user(db=db, user_id=user_id)
    return user_to_delete

## Create game room
@app.post("/create/game-room", response_model=models.GameLog)
def create_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], new_game_room: int, db: Session = Depends(get_db)):
    db_game_room = game_room.create_game_room(db=db, game_room=new_game_room)
    return game_log.send_game_log(db=db, game_room_id=db_game_room.id, user_id=current_user.id, message=schemas.GameMessage.ENTER)

## Get game rooms
@app.get("/game-rooms/", response_model=list[models.GameRoom])
def read_game_rooms(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    game_rooms = game_room.get_game_rooms(db)
    return game_rooms

## Get specific game room
@app.get("/game-room/{game_room_id}", response_model=models.GameRoom)
def read_game_rooms(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    db_game_room = game_room.get_game_room(db, game_room_id=game_room_id)
    return db_game_room

## Enter game room
@app.post("/enter/game-room/{game_room_id}", response_model=models.GameLog)
def enter_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_room.enter_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return game_log.send_enter_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)

## Leave game room
@app.post("/leave/game-room/{game_room_id}", response_model=models.GameLog)
def leave_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_room.leave_game_room(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return game_log.send_leave_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)

## Start game room
@app.post("/start/game-room/{game_room_id}", response_model=models.GameLog)
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    db_game_log = game_log.send_start_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)
    return db_game_log

@app.delete("/game-room/{game_room_id}")
def delete_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    game_room.delete_game_room(db=db, game_room_id=game_room_id)
    return {"message": "Game room deleted"}

## Pass game round
@app.post("/game-room/{game_room_id}/game-round/{game_round_id}/pass")
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    can_pass = game_round.can_pass_round(db, game_round_id, current_user.id)
    db_game_log = None
    if (can_pass):
        db_game_log = game_log.send_pass_round_log(db=db, game_room_id=game_room_id, user_id=current_user.id, game_round_id=game_round_id)
        game_round.pass_round(db=db, game_round_id=game_round_id)
    return db_game_log 

## Auto pass round.
@app.post("/game-room/{game_room_id}/game-round/{game_round_id}/auto-pass")
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    db_game_log = game_log.send_pass_round_log(db=db, game_room_id=game_room_id, user_id=current_user.id, game_round_id=game_round_id, auto=True)
    game_round.pass_round(db=db, game_round_id=game_round_id)
    return db_game_log 

@app.post("/game-room/{game_room_id}/game-round/{game_round_id}/can-user-pass-auto")
def can_user_pass(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    return {"can_pass": game_round.can_user_pass_round_auto(db=db, game_room_id=game_room_id, game_round_id=game_round_id)}

## Check game room state
@app.get("/game-room/{game_room_id}/state", response_model=models.GameRoomState)
def read_game_room_state(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return game_room.set_game_room_state(db=db, game_room_id=game_room_id)

## Make round
@app.get("/game-room/{game_room_id}/round", response_model=models.GameRound)
def random_challenge(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    db_challenge = challenge.get_random_challenge(db=db, game_room_id=game_room_id)
    #TODO: make pass the random challenge to the round creation.
    return game_round.add_game_round(db=db, challenge_id=19, game_room_id=game_room_id)

## Start round
@app.post("/round/{game_round_id}/start", response_model=models.GameLog)
def start_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_round_id: int, db: Session = Depends(get_db)):
    db_game_log = game_log.send_start_game_log(db=db, game_round_id=game_round_id, user_id=current_user.id)
    return db_game_log

## Finish game round
@app.post("/round/{game_round_id}/finish", response_model=models.GameLog)
def finish_game_round(current_user: Annotated[models.User, Depends(get_current_active_user)], game_round_id: int, db: Session = Depends(get_db)):
    db_game_log = game_log.send_next_round_log(db=db, game_round_id=game_round_id, user_id=current_user.id)
    game_round.finish_game_round(db=db, game_round_id=game_round_id)
    return db_game_log

## Get round solution
@app.get("/game-room/{game_room_id}/round/{game_round_id}/solution", response_model=models.Attempt)
def get_round_solution(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    return game_round.get_round_solution(db=db, game_round_id=game_round_id)

## Send seen solution.
@app.post("/game-room/{game_room_id}/round/{game_round_id}/seen-solution", response_model=models.GameLog)
def seen_solution(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, game_round_id: int, db: Session = Depends(get_db)):
    return game_log.send_seen_solution_log(db=db, game_round_id=game_round_id, user_id=current_user.id)

## Finish game room
@app.post("/finish/game-room/{game_room_id}", response_model=models.GameLog)
def finish_game_room(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    db_game_log = game_log.send_finish_game_log(db=db, game_room_id=game_room_id, user_id=current_user.id)
    game_room.finish_game_room(db=db, game_room_id=game_room_id)
    return db_game_log

## Get winner
@app.get("/game-room/{game_room_id}/winner", response_model=list[models.UserBasics])
def get_winner(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return game_room.get_winner(db=db, game_room_id=game_room_id)

## Get game results
@app.get("/game-room/{game_room_id}/results", response_model=list[models.GameRoomSummary])
def get_game_results(current_user: Annotated[models.User, Depends(get_current_active_user)], game_room_id: int, db: Session = Depends(get_db)):
    return game_room.get_game_results(db=db, game_room_id=game_room_id)

@app.get('/users/{user_id}/export', response_model=list[models.Attempt])
def export_user_attempts(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    return attempt.get_user_attempts(db, user_id)

@app.get('/code-file-dictionary', response_model=dict)
def get_code_file_dictionary(db: Session = Depends(get_db)):
    return code_file_dictionary.get_code_file_dictionary(db)

@app.get('/admin/pending-admins', response_model=list[models.UserBasics])
def get_non_validated_users(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    if current_user.user_type != schemas.UserType.ADMIN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user.get_non_validated_users(db)

@app.post('/admin/validate-admin/{user_id}', response_model=models.UserBasics)
def validate_user(current_user: Annotated[models.User, Depends(get_current_active_user)], user_id: int, db: Session = Depends(get_db)):
    if current_user.user_type != schemas.UserType.ADMIN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user.validate_user(db, user_id)

@app.get('/challenges/{challenge_id}/comments', response_model=list[models.ChallengeComments])
def get_challenge_comments(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, db: Session = Depends(get_db)):
    return attempt.get_passed_attempts_comments(db, challenge_id)

@app.post('/challenges/{challenge_id}/comments/{attempt_id}/score', response_model=models.AttemptScore)
def score_challenge_comment(current_user: Annotated[models.User, Depends(get_current_active_user)], attempt_score: models.AttemptScore, db: Session = Depends(get_db)):
    result = attempt.create_attempt_score(db, user_id=current_user.id, attempt_id=attempt_score.attempt_id, given_score=attempt_score.given_score)
    return attempt.add_comment_score(db, attempt_id=attempt_score.attempt_id, given_score=attempt_score.given_score) if result is not None else None

@app.get('/challenges/{challenge_id}/comments/scores/{user_id}', response_model=list[models.AttemptScore])
def get_user_attempt_scores(current_user: Annotated[models.User, Depends(get_current_active_user)], challenge_id: int, user_id: int, db: Session = Depends(get_db)):
    return attempt.get_user_attempt_scores(db, challenge_id=challenge_id, user_id=user_id)

@app.get('/challenges/attempts/')
def get_all_attempts(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    if (current_user.user_type == schemas.UserType.ADMIN):
        return attempt.get_all_attempts_by_challenge(db)
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get('/leaderboard/')
def get_leaderboard(current_user: Annotated[models.User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    if (current_user.user_type == schemas.UserType.ADMIN):
        return leaderboard.get_admin_leaderboard(db)
    else:
        return leaderboard.get_player_leaderboard(db)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
    #uvicorn.run(app, host="10.227.242.121", port=8000, ssl_keyfile="./gamflew_api.key", ssl_certfile="./gamflew_api.pem")

