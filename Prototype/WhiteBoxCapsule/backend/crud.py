import json
import datetime
from sqlalchemy.orm import Session
from fastapi import File
from sqlalchemy.exc import SQLAlchemyError
from dateutil.relativedelta import *

import random

import models
import schemas
import auth

def at_least_one_month_after(token_date):
    current_date = datetime.datetime.now()

    # Calculate the difference in months
    months_difference = (
        (current_date.year - token_date.year) * 12 +
        current_date.month - token_date.month
    )

    return months_difference >= 1

def create_user(db: Session, user: schemas.User):
    hashed_password = auth.get_password_hash(user.password)
    db_user = schemas.User(
        name=user.name,
        username=user.username,
        email = user.email,
        picture=user.picture,
        password=hashed_password,
        user_type=user.user_type,
        failed_attempts=0,
        successful_attempts=0,
        score=0,
        achievements=0,
        auth = False
    )
    db.add(db_user)
    db.commit()
    return db_user

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = schemas.Challenge(
        name=challenge.name,
        description=challenge.description,
        hint=challenge.hint,
        objective=challenge.objective,
        test_cases_count=challenge.test_cases_count,
        score=challenge.score,
        initial_board=challenge.initial_board,
        code_file=challenge.code_file,
        challenge_type=challenge.challenge_type,
        passing_criteria=challenge.passing_criteria,
        achievement_criteria=challenge.achievement_criteria,
        owner_id=challenge.owner_id,
        difficulty=challenge.difficulty
    )
    db.add(db_challenge)
    db.commit()
    return db_challenge

def update_challenge(db: Session, challenge_id: int, challenge: schemas.Challenge):
    db_challenge = db.query(schemas.Challenge).filter(schemas.Challenge.id == challenge_id).first()

    if db_challenge is None:
        return None

    db_challenge.name = challenge.name
    db_challenge.description = challenge.description
    db_challenge.hint = challenge.hint
    db_challenge.objective = challenge.objective
    db_challenge.test_cases_count = challenge.test_cases_count
    db_challenge.score = challenge.score
    db_challenge.initial_board = challenge.initial_board
    db_challenge.code_file = challenge.code_file
    db_challenge.challenge_type = challenge.challenge_type
    db_challenge.passing_criteria = challenge.passing_criteria
    db_challenge.achievement_criteria = challenge.achievement_criteria
    db_challenge.owner_id = challenge.owner_id
    db_challenge.difficulty = challenge.difficulty

    db.commit()
    return db_challenge

def create_code_file(db: Session, code_file: schemas.CodeFile):
    db_code_file = schemas.CodeFile(
        name=code_file.name,
        content=code_file.content,
        dictionary=code_file.dictionary
    )
    db.add(db_code_file)
    db.commit()
    return db_code_file

def create_board_state(db: Session, board_state: schemas.BoardState):
    db_board_state = schemas.BoardState(
        name=board_state.name,
        board_state=board_state.board_state,
        out_of_bounds_state=board_state.out_of_bounds_state
    )
    db.add(db_board_state)
    db.commit()
    return db_board_state

def create_attempt(db: Session, attempt: schemas.Attempt):
    db_attempt = schemas.Attempt(
        score=attempt.score,
        player_id=attempt.player_id,
        challenge_id=attempt.challenge_id,
        attempt_type=attempt.attempt_type,  # attempt.pass or attempt.fail
        comment=attempt.comment,
        test_cases=attempt.test_cases
    )

    db.add(db_attempt)
    db.commit() # Save create attempt to db
    return db_attempt

def get_user_basics(db: Session, user_id: str):
    user = db.query(schemas.User).filter(schemas.User.id == user_id).first()

    user_basics = models.UserBasics(
        id=user.id,
        name=user.name,
        picture=user.picture,
        username=user.username,
        failed_attempts=user.failed_attempts,
        successful_attempts=user.successful_attempts,
        score=user.score,
        achievements=user.achievements,
        user_type=user.user_type
    )

    return user_basics

def get_user(db: Session, user_id: int):
    return db.query(schemas.User).filter(schemas.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    user = db.query(schemas.User).filter(schemas.User.username == username).first()

    if user is not None:
        user = models.UserResponse(
            name=user.name,
            username=user.username,
            email=user.email,
            user_type=user.user_type,
            picture=user.picture,
        )

    return user

def get_user_by_email(db: Session, email: str):
    return db.query(schemas.User).filter(schemas.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 500):
    users = db.query(schemas.User).limit(limit).offset(skip).all()

    user_basics = []
    for user in users:
        user_basics_inst = models.UserBasics(
            id=user.id,
            name=user.name,
            username=user.username,
            user_type=user.user_type,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            picture=user.picture,
            score=user.score,
            achievements=user.achievements
        )
        user_basics.append(user_basics_inst)

    return user_basics

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Challenge).offset(skip).limit(limit).all()

def get_challenges_by_code(db: Session):
    challenges = db.query(schemas.Challenge).order_by(schemas.Challenge.code_file).all()

    code_file = ''
    challenges_by_code = {}
    for v in challenges:
        if (code_file != v.code_file):
            code_file = v.code_file
            challenges_by_code[code_file] = []
        
        challenges_by_code[code_file].append(v)
    
    return challenges_by_code

def get_code_files(db: Session):
    return db.query(schemas.CodeFile).all()

def get_code_file(db: Session, code_file_id: int):
    return db.query(schemas.CodeFile).filter(schemas.CodeFile.id == code_file_id).first()

def get_challenge(db: Session, challenge_id: int):
    return db.query(schemas.Challenge).filter(schemas.Challenge.id == challenge_id).first()

def get_random_challenge(db: Session, game_room_id: int):
    challenge_count = int(db.query(schemas.Challenge).count())
    random_id = random.randint(1, challenge_count)
    random_challenge = db.query(schemas.Challenge).filter(schemas.Challenge.id == random_id).first()

    game_rounds = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).all()

    if (len(game_rounds) == 0):
        return random_challenge

    for round in game_rounds:
        if round.challenge_id == random_challenge.id:
            return get_random_challenge(db, game_room_id)
        else:
            continue

    return random_challenge

def get_board_states(db: Session):
    return db.query(schemas.BoardState).all()

def get_board_state(db: Session, board_state_id: int):
    return db.query(schemas.BoardState).filter(schemas.BoardState.id == board_state_id).first()

def create_user_challenge(db: Session, challenge: schemas.Challenge, user_id: int):
    db_challenge = schemas.Challenge(
        **challenge.model_dump(), owner_id=user_id)
    db.add(db_challenge)
    db.commit()
    return db_challenge

def get_passed_challenges(db: Session, user_id: int):
    passed_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass")
    passed_challenges_ids = [attempt.challenge_id for attempt in passed_attempts]
    return passed_challenges_ids

def delete_user(db: Session, user_id: int):
    user_to_delete = get_user(db, user_id)
    if user_to_delete is None:
        return None
    db.delete(user_to_delete)
    db.commit()
    return user_to_delete

def get_user_score(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user is None:
        return None
    
    covered_challenges = get_passed_challenges(db, user_id) # Get all challenges that the user has passed, to help in finding the highscores.

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass")

    user_score = 0
    for challenge_id in covered_challenges:
        attempts = successful_attempts.filter(schemas.Attempt.challenge_id == challenge_id)

        attempts.order_by(schemas.Attempt.score.desc())

        user_score += attempts[0].score ## Only count the highest-scored attempt for each challenge.

    return user_score

def update_user_stats(db: Session, user_id: int):
    user_to_update = get_user(db, user_id)
    if user_to_update is None:
        return None

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass").count()
    failed_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "fail").count()
    score = get_user_score(db, user_id)
    # TODO: Add achievements

    user_to_update.successful_attempts = successful_attempts
    user_to_update.failed_attempts = failed_attempts
    user_to_update.score = score

    db.commit()

    return user_to_update

def update_user_auth(db: Session, user_id: int, auth: bool):
    user_to_update = get_user(db, user_id)
    if user_to_update is None:
        return None

    user_to_update.auth = auth

    db.commit()

    return user_to_update

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
    expired_tokens = db.query(schemas.Token).filter(schemas.Token.date <= current_date).all()
    return expired_tokens

def delete_blacklisted_token(db: Session, token_id: int):
    token_to_delete = get_blacklisted_token(db, token_id)
    if token_to_delete is None:
        return None
    db.delete(token_to_delete)
    db.commit()
    return token_to_delete

def create_game_room(db: Session, game_room: schemas.GameRoom):
    db_game_room = schemas.GameRoom(
        name=game_room.name,
        rounds=game_room.rounds,
        player_1_id=game_room.player_1_id,
        player_number=game_room.player_number,
        game_state=schemas.GameState.WAITING
    )
    db.add(db_game_room)
    db.commit()
    return db_game_room

def get_game_room(db: Session, game_room_id: int):
    return db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_room_id).first()

def get_game_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.GameRoom).offset(skip).limit(limit).all()

def get_game_room_by_name(db: Session, name: str):
    return db.query(schemas.GameRoom).filter(schemas.GameRoom.name == name).first()

def check_game_room_full(game_room: schemas.GameRoom):
    if (game_room.player_number == 2):
        return game_room.player_2 is not None
    elif (game_room.player_number == 3):
        return game_room.player_2 is not None and game_room.player_3 is not None
    return False

def get_players_in(db: Session, game_room_id: int):
    players_in = []
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None
    
    start_messages = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(schemas.GameLog.message==schemas.GameMessage.START).order_by(schemas.GameLog.id.desc()).limit(3).all()
    leave_messages_p1 = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(schemas.GameLog.message==schemas.GameMessage.LEAVE).filter(schemas.GameLog.user_id==game_room.player_1_id).order_by(schemas.GameLog.id.desc()).first()
    leave_messages_p2 = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(schemas.GameLog.message==schemas.GameMessage.LEAVE).filter(schemas.GameLog.user_id==game_room.player_2_id).order_by(schemas.GameLog.id.desc()).first()
    leave_messages_p3 = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(schemas.GameLog.message==schemas.GameMessage.LEAVE).filter(schemas.GameLog.user_id==game_room.player_3_id).order_by(schemas.GameLog.id.desc()).first()

    player_1_in = False
    player_2_in = False
    player_3_in = False
    for message in start_messages:
        if (message.user_id == game_room.player_1_id and not player_1_in and message.id > (leave_messages_p1.id if leave_messages_p1 is not None else 0)):
            players_in.append(game_room.player_1_id)
            player_1_in = True
        elif (message.user_id == game_room.player_2_id and not player_2_in and message.id > (leave_messages_p2.id if leave_messages_p2 is not None else 0)):
            players_in.append(game_room.player_2_id)
            player_2_in = True
        elif (message.user_id == game_room.player_3_id and not player_3_in and message.id > (leave_messages_p3.id if leave_messages_p3 is not None else 0)):
            players_in.append(game_room.player_3_id)
            player_3_in = True
    
    return players_in

def get_game_room_state(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    game_room_state = models.GameRoomState(
        id=game_room.id,
        players_in=get_players_in(db, game_room_id),
        game_state=game_room.game_state,
        game_over=game_room.game_over,
        game_winner=game_room.game_winner
    )

    return game_room_state

def set_game_room_state(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None
    
    players_in = get_players_in(db, game_room_id)
    game_room.players_in = players_in

    if (len(players_in) < game_room.player_number):
        game_room.game_state = schemas.GameState.WAITING
    elif (len(players_in) == game_room.player_number and game_room.game_state == schemas.GameState.WAITING):
        game_room.game_state = schemas.GameState.READY
        print('Game room ready')
    elif (game_room.game_state == schemas.GameState.READY):
        game_room.game_state = schemas.GameState.PLAYING
        print('Game room playing')

    db.commit()
    return get_game_room_state(db=db, game_room_id=game_room_id)

def send_game_log(db: Session, game_room_id: int, user_id: int, message: schemas.GameMessage):
    db_game_message = schemas.GameLog(
        message=message,
        game_room_id=game_room_id,
        user_id=user_id
    )
    db.add(db_game_message)
    db.commit()
    return db_game_message

def send_start_game_log(db: Session, game_room_id: int, user_id: int):
    game_room_to_log = get_game_room(db, game_room_id)

    if game_room_to_log is None:
        raise ValueError("Game room does not exist.")
    
    if (game_room_to_log.player_1_id != user_id and game_room_to_log.player_2_id != user_id and game_room_to_log.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    db_game_log = schemas.GameLog(
        message=schemas.GameMessage.START,
        game_room_id=game_room_id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def is_in_game_room(db: Session, game_room_id: int, user_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return False
    
    return (game_room.player_1_id == user_id or game_room.player_2_id == user_id or game_room.player_3_id == user_id)

def enter_game_room(db: Session, game_room_id: int, user_id: int):
    game_room_to_join = get_game_room(db, game_room_id)

    if game_room_to_join is None:
        return None
    
    if is_in_game_room(db, game_room_id, user_id):
        return None

    if game_room_to_join.player_2_id is None:
        setattr(game_room_to_join, 'player_2_id', user_id)
    elif game_room_to_join.player_3_id is None:
        setattr(game_room_to_join, 'player_3_id', user_id)

    if (check_game_room_full(game_room_to_join)):
        ready_game_room(db, game_room_id)
    
    db.commit()
    return game_room_to_join

def leave_game_room(db: Session, game_room_id: int, user_id: int):
    game_room_to_leave = get_game_room(db, game_room_id)

    if game_room_to_leave is None:
        return None
    
    if game_room_to_leave.player_2_id == user_id:
        game_room_to_leave.player_2_id = None
    elif game_room_to_leave.player_3_id == user_id:
        game_room_to_leave.player_3_id = None

    game_room_to_leave.game_state = schemas.GameState.WAITING
    db.commit()
    return game_room_to_leave

def ready_game_room(db: Session, game_room_id: int):
    game_room_to_ready = get_game_room(db, game_room_id)

    if game_room_to_ready is None:
        return None
    
    game_room_to_ready.game_state = schemas.GameState.READY
    db.commit()
    return game_room_to_ready

def finish_game_room(db: Session, game_room_id: int):
    game_room_to_close = get_game_room(db, game_room_id)

    if game_room_to_close is None:
        return None
    
    game_room_to_close.game_state = schemas.GameState.FINISHED
    db.commit()
    return game_room_to_close

def get_random_player(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None
    
    if (game_room.player_number == 2):
        return random.choice([game_room.player_1_id, game_room.player_2_id])
    elif (game_room.player_number == 3):
        return random.choice([game_room.player_1_id, game_room.player_2_id, game_room.player_3_id])
    
    return game_room.player_1_id

def add_game_round(db: Session, game_room_id: int, challenge_id: int, next: bool = False):
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()

    if (game_round is not None and game_round.state == schemas.GameRoundState.ONGOING):
        return game_round

    game_room = get_game_room(db, game_room_id)

    if game_round is None:
        round_number = 1
    else:
        round_number = game_round.round_number + 1
    
    db_game_round = schemas.GameRound(
        game_room_id=game_room_id,
        user_id=get_random_player(db, game_room_id),
        challenge_id=challenge_id,
        round_number=round_number,
        max_rounds=game_room.rounds,
        state=schemas.GameRoundState.ONGOING
    )
    db.add(db_game_round)
    db.commit()
    return db_game_round

def finish_game_round(db: Session, game_round_id: int):
    game_round_to_finish = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
    game_room = get_game_room(db, game_round_to_finish.game_room_id)

    if game_round_to_finish is None:
        return None
    
    game_round_to_finish.state = schemas.GameRoundState.FINISHED
    game_room.game_state = schemas.GameState.READY

    db.commit()
    return game_round_to_finish
