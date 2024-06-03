import json
import datetime
from sqlalchemy.orm import Session
from fastapi import File
from sqlalchemy.exc import SQLAlchemyError
from dateutil.relativedelta import *
from functools import cmp_to_key

import random

import models
import schemas
import auth

def create_general_achievement(db: Session, general_achievement: schemas.GeneralAchievement):
    db_general_achievement = schemas.GeneralAchievement(
        name=general_achievement.name,
        description=general_achievement.description,
        hint=general_achievement.hint
    )
    db.add(db_general_achievement)
    db.commit()
    return db_general_achievement

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
        email=user.email,
        picture=user.picture,
        password=hashed_password,
        user_type=user.user_type,
        failed_attempts=0,
        successful_attempts=0,
        score=0,
        achievements=0,
        auth=False,
        validated=user.validated
    )
    db.add(db_user)
    db.commit()
    return db_user

def edit_user(db: Session, user_id: int, user: schemas.User):
    db_user = db.query(schemas.User).filter(schemas.User.id == user_id).first()

    if db_user is None:
        return None

    db_user.name = user.name
    db_user.username = user.username
    db_user.email = user.email
    db_user.picture = user.picture
    db_user.user_type = user.user_type
    db_user.validated = user.validated

    db.commit()
    return db_user

def create_challenge(db: Session, challenge: schemas.Challenge):
    db_challenge = schemas.Challenge(
        name=challenge.name,
        hint=challenge.hint,
        objective=challenge.objective,
        test_cases_count=challenge.test_cases_count,
        score=challenge.score,
        initial_board=challenge.initial_board,
        code_file=challenge.code_file,
        challenge_type=challenge.challenge_type,
        passing_criteria=challenge.passing_criteria,
        achievement=challenge.achievement,
        achievement_hint=challenge.achievement_hint,
        owner_id=challenge.owner_id,
        difficulty=challenge.difficulty
    )
    db.add(db_challenge)
    db.commit()
    return db_challenge

def update_challenge(db: Session, challenge_id: int, challenge: schemas.Challenge):
    db_challenge = db.query(schemas.Challenge).filter(
        schemas.Challenge.id == challenge_id).first()

    if db_challenge is None:
        return None

    db_challenge.name = challenge.name
    db_challenge.hint = challenge.hint
    db_challenge.objective = challenge.objective
    db_challenge.test_cases_count = challenge.test_cases_count
    db_challenge.score = challenge.score
    db_challenge.initial_board = challenge.initial_board
    db_challenge.code_file = challenge.code_file
    db_challenge.challenge_type = challenge.challenge_type
    db_challenge.passing_criteria = challenge.passing_criteria
    db_challenge.achievement = challenge.achievement
    db_challenge.owner_id = challenge.owner_id
    db_challenge.difficulty = challenge.difficulty

    db.commit()
    return db_challenge

def create_code_file(db: Session, code_file: schemas.CodeFile):
    db_code_file = schemas.CodeFile(
        name=code_file.name,
        content=code_file.content
    )
    db.add(db_code_file)
    db.commit()
    return db_code_file

def create_code_file_dictionary(db: Session, code_file_dictionary: schemas.CodeFileDictionary):
    db_code_file_dictionary = schemas.CodeFileDictionary(
            expression=code_file_dictionary.expression,
            replacement=code_file_dictionary.replacement
    )
    db.add(db_code_file_dictionary)
    db.commit()
    return db_code_file_dictionary

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
        achievement=attempt.achievement,
        comment=attempt.comment,
        test_cases=attempt.test_cases,
        game_round_id=attempt.game_round_id,
        comment_score_count=attempt.comment_score_count,
        comment_score=attempt.comment_score
    )

    db.add(db_attempt)
    db.commit()  # Save create attempt to db
    return db_attempt


def get_user_basics(db: Session, user_id: str):
    if user_id is None:
        return None

    user = db.query(schemas.User).filter(schemas.User.id == user_id).first()

    user_basics = models.UserBasics(
        id=user.id,
        name=user.name,
        picture=user.picture,
        email=user.email,
        username=user.username,
        failed_attempts=user.failed_attempts,
        successful_attempts=user.successful_attempts,
        score=user.score,
        achievements=user.achievements,
        user_type=user.user_type,
        validated=user.validated
    )

    return user_basics


def get_user(db: Session, user_id: int):
    return db.query(schemas.User).filter(schemas.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    user = db.query(schemas.User).filter(
        schemas.User.username == username).first()

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
            email=user.email,
            user_type=user.user_type,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            picture=user.picture,
            score=user.score,
            achievements=user.achievements,
            validated=user.validated
        )
        user_basics.append(user_basics_inst)

    return user_basics

def get_users_by_id(db: Session, user_ids: list[int]):
    users = db.query(schemas.User).filter(schemas.User.id.in_(user_ids)).all()

    user_basics = []
    for user in users:
        user_basics_inst = models.UserBasics(
            id=user.id,
            name=user.name,
            email=user.email,
            username=user.username,
            user_type=user.user_type,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            picture=user.picture,
            score=user.score,
            achievements=user.achievements,
            validated=user.validated
        )
        user_basics.append(user_basics_inst)

    return user_basics if len(user_basics) > 0 else None

def get_user_by_id(db: Session, user_id: int):
    return db.query(schemas.User).filter(schemas.User.id == user_id).first()

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Challenge).offset(skip).limit(limit).all()


def get_challenges_by_code(db: Session):
    challenges = db.query(schemas.Challenge).order_by(
        schemas.Challenge.code_file).all()

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


def get_random_challenge(db: Session, game_room_id: int, exclude_challenges: list[int] = []):
    challenge_count = int(db.query(schemas.Challenge).count())
    game_room = get_game_room(db, game_room_id)
    random_id = random.randint(1, challenge_count)
    random_challenge = db.query(schemas.Challenge).filter(
        schemas.Challenge.id == random_id).first()

    game_rounds = db.query(schemas.GameRound).filter(
        schemas.GameRound.game_room_id == game_room_id).all()
    played_challenges = [round.challenge_id for round in game_rounds if round.state == schemas.GameRoundState.FINISHED]
    passed_challenges = get_passed_challenges(db=db, user_id=game_room.player_1_id) + get_passed_challenges(db=db, user_id=game_room.player_2_id) + (get_passed_challenges(db=db, user_id=game_room.player_3_id) if game_room.player_3_id != None else [])
    passed_or_played = list(set(played_challenges + passed_challenges))

    if (len(game_rounds) == 0 or random_challenge.id not in passed_or_played):
        return random_challenge
    else:
        exclude_challenges.append(random_challenge.id)
        return get_random_challenge(db=db, game_room_id=game_room_id, exclude_challenges=exclude_challenges)
    
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
    passed_challenges_ids = list(set(passed_challenges_ids))
    return passed_challenges_ids

def get_passed_challenge(db: Session, user_id: int, challenge_id: int):
    passed_attempt = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.challenge_id == challenge_id).filter(schemas.Attempt.attempt_type == "pass").first()
    return passed_attempt

def get_unlocked_challenge_achievements(db: Session, user_id: int):
    achievement_unlocked_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.achievement == True).filter(schemas.Attempt.attempt_type == "pass")
    unlocked_challenges = [attempt.challenge_id for attempt in achievement_unlocked_attempts]
    unlocked_challenges = list(set(unlocked_challenges))
    return unlocked_challenges

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

    # Get all challenges that the user has passed, to help in finding the highscores.
    covered_challenges = get_passed_challenges(db, user_id)
    won_multiplayer_games = db.query(schemas.GameRoom).filter(
        schemas.GameRoom.game_state == schemas.GameState.FINISHED
    ).filter(
        schemas.GameRoom.game_winner_1_id == user_id or
        schemas.GameRoom.game_winner_2_id == user_id or
        schemas.GameRoom.game_winner_3_id == user_id
    ).all()
    played_multiplayer_games = db.query(schemas.GameRoom).filter(
        schemas.GameRoom.player_1_id == user_id or
        schemas.GameRoom.player_2_id == user_id or 
        schemas.GameRoom.player_3_id == user_id
    ).filter(
        schemas.GameRoom.game_state == schemas.GameState.FINISHED
    ).filter(
        schemas.GameRoom.game_winner_1_id != user_id and
        schemas.GameRoom.game_winner_2_id != user_id and
        schemas.GameRoom.game_winner_3_id != user_id
    ).all()

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.game_round_id == None).filter(schemas.Attempt.attempt_type == "pass")

    user_score = 0

    # Add the score of each challenge that the user has passed.
    for challenge_id in covered_challenges:
        attempts = successful_attempts.filter(
            schemas.Attempt.challenge_id == challenge_id)

        attempts.order_by(schemas.Attempt.score.desc())

        if attempts.count() == 0:
            continue

        # Only count the highest-scored attempt for each challenge.
        user_score += attempts[0].score

    user_score += len(won_multiplayer_games) * 50 # 50 points for winning a multiplayer game
    user_score += len(played_multiplayer_games) * 25 # 25 points for playing a multiplayer game
    user_score += get_user_achievements_points(db=db, user_id=user_id) # Each unlocked achievement gives points.

    return user_score

def get_user_achievements_points(db: Session, user_id: int):
    achievement_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.achievement == True)
    general_achievements = db.query(schemas.UserGeneralAchievement).filter(schemas.UserGeneralAchievement.user_id == user_id).all()

    challenges = []
    user_score = 0
    for attempt in achievement_attempts:
        challenge = get_challenge(db=db, challenge_id=attempt.challenge_id)

        if (attempt.challenge_id in challenges):
            continue

        challenges.append(attempt.challenge_id)

        match (challenge.difficulty):
            case schemas.Difficulty.VERY_EASY:
                # 100 points for Very Easy.
                user_score += 100
                break
            case schemas.Difficulty.EASY:
                # 150 for Easy.
                user_score += 150
                break
            case schemas.Difficulty.NORMAL:
                # 300 for Normal.
                user_score += 300
                break
            case schemas.Difficulty.HARD:
                # 500 for Hard.
                user_score += 500
                break
            case schemas.Difficulty.VERY_HARD:
                # 750 for Very Hard.
                user_score += 750
                break
    
    user_score += len(general_achievements) * 1000 # 1000 points for each general achievement.
    
    return user_score

def get_general_achievements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.GeneralAchievement).offset(skip).limit(limit).all()

def get_user_general_achievements(db: Session, user_id: int):
    user_general_achievements = db.query(schemas.UserGeneralAchievement).filter(schemas.UserGeneralAchievement.user_id == user_id).all()

    return [a.general_achievement_id for a in user_general_achievements]

def get_user_challenge_achievements(db: Session, user_id: int):
    user_challenge_achievements = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.achievement == True).all()

    return [a.challenge_id for a in user_challenge_achievements]

def update_user_stats(db: Session, user_id: int):
    user_to_update = get_user(db, user_id)
    if user_to_update is None:
        return None

    successful_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass").count()
    failed_attempts = db.query(schemas.Attempt).filter(
        schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "fail").count()
    score = get_user_score(db, user_id)

    achievement_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.achievement == True)
    general_achievements = db.query(schemas.UserGeneralAchievement).filter(schemas.UserGeneralAchievement.user_id == user_id).all()
    achievements = len(set([attempt.challenge_id for attempt in achievement_attempts])) + len(set([achievement.general_achievement_id for achievement in general_achievements]))

    user_to_update.successful_attempts = successful_attempts
    user_to_update.failed_attempts = failed_attempts
    user_to_update.score = score
    user_to_update.achievements = achievements

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
    expired_tokens = db.query(schemas.Token).filter(
        schemas.Token.date <= current_date).all()
    return expired_tokens


def delete_blacklisted_token(db: Session, token_id: int):
    token_to_delete = get_blacklisted_token(db, token_id)
    if token_to_delete is None:
        return None
    db.delete(token_to_delete)
    db.commit()
    return token_to_delete

def create_game_room_api(db: Session, game_room: models.CreateGameRoom):
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

def delete_game_room(db: Session, game_room_id: int):
    game_room_to_delete = get_game_room(db, game_room_id)
    if game_room_to_delete is None:
        return None
    delete_game_logs_from_room(db, game_room_id)

    db.delete(game_room_to_delete)
    db.commit()
    return game_room_to_delete

def delete_game_logs_from_room(db: Session, game_room_id: int):
    game_logs_to_delete = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).all()
    for log in game_logs_to_delete:
        db.delete(log)
    db.commit()

def get_game_room(db: Session, game_room_id: int):
    return db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_room_id).first()

def get_game_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.GameRoom).filter(schemas.GameRoom.game_state != schemas.GameState.FINISHED).offset(skip).limit(limit).all()

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

    start_messages = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(
        schemas.GameLog.message == schemas.GameMessage.START).order_by(schemas.GameLog.id.desc()).limit(3).all()
    leave_messages_p1 = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(
        schemas.GameLog.message == schemas.GameMessage.LEAVE).filter(schemas.GameLog.user_id == game_room.player_1_id).order_by(schemas.GameLog.id.desc()).first()
    leave_messages_p2 = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(
        schemas.GameLog.message == schemas.GameMessage.LEAVE).filter(schemas.GameLog.user_id == game_room.player_2_id).order_by(schemas.GameLog.id.desc()).first()
    leave_messages_p3 = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(
        schemas.GameLog.message == schemas.GameMessage.LEAVE).filter(schemas.GameLog.user_id == game_room.player_3_id).order_by(schemas.GameLog.id.desc()).first()

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
    game_round = get_last_finished_round(db=db, game_room_id=game_room_id)

    if game_round is not None:
        game_round_id = game_round.id
    else: 
        game_round_id = None

    game_room_state = models.GameRoomState(
        id=game_room.id,
        players_in=get_players_in(db, game_room_id),
        game_state=game_room.game_state,
        pass_round=get_last_passed_round(db, game_room_id),
        game_over=game_room.game_over,
        last_round_id=game_round_id,
        game_winner_1_id=game_room.game_winner_1_id,
        game_winner_2_id=game_room.game_winner_2_id,
        game_winner_3_id=game_room.game_winner_3_id
    )

    return game_room_state

def get_last_finished_round(db: Session, game_room_id: int):
    return db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).filter(schemas.GameRound.state == schemas.GameRoundState.FINISHED).order_by(schemas.GameRound.id.desc()).first()

def get_last_passed_round(db: Session, game_room_id: int):
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()
    most_recent_pass_round_log = db.query(schemas.GameLog).filter(schemas.GameLog.game_room_id == game_room_id).filter(schemas.GameLog.message == schemas.GameMessage.PASS or schemas.GameLog.message == schemas.GameMessage.AUTO_PASS).order_by(schemas.GameLog.id.desc()).first()

    if (game_round is None or  most_recent_pass_round_log is None):
        return None

    if (game_round.id == most_recent_pass_round_log.game_round_id):
        return game_round.id
    else:
        return None


def get_game_round(db: Session, game_round_id: int):
    return db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()

def get_game_round_by_game_room(db: Session, game_room_id: int):
    return db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()

def get_finished_rounds_by_game_room(db: Session, game_room_id: int):
    return db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).filter(schemas.GameRound.state == schemas.GameRoundState.FINISHED).all()

def set_game_room_state(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)
    game_round = get_game_round_by_game_room(db, game_room_id)
    game_rounds = get_finished_rounds_by_game_room(db, game_room_id)

    if game_room is None:
        return None

    players_in = get_players_in(db, game_room_id)
    game_room.players_in = players_in
    
    if (len(players_in) < game_room.player_number and len(game_rounds) != game_room.rounds and game_room.game_state != schemas.GameState.WAITING):
        print('waiting 1')
        game_room.game_state = schemas.GameState.WAITING
    elif (len(players_in) == game_room.player_number and game_room.game_state == schemas.GameState.WAITING and len(game_rounds) != game_room.rounds):
        print('ready 1')
        game_room.game_state = schemas.GameState.READY
    elif (game_room.game_state == schemas.GameState.READY):
        print('playing 1')
        game_room.game_state = schemas.GameState.PLAYING
    elif (game_room.game_state == schemas.GameState.PASS_ROUND):
        print('waiting 2')
        game_room.game_state = schemas.GameState.WAITING
    elif (game_room.game_state == schemas.GameState.SHOW_SOLUTION and have_seen_game_logs(db=db, game_round_id=game_round.id)):
        print('next round 1')
        game_room.game_state = schemas.GameState.NEXT_ROUND
    elif (game_room.game_state == schemas.GameState.SHOW_SOLUTION and not have_seen_game_logs(db=db, game_round_id=game_round.id)):
        print('show solution 1')
        game_room.game_state = schemas.GameState.SHOW_SOLUTION
    elif (game_round.state == schemas.GameRoundState.FINISHED and game_room.game_state != schemas.GameState.NEXT_ROUND):
        print('show solution 2')
        game_room.game_state = schemas.GameState.SHOW_SOLUTION
    elif (game_room.game_state == schemas.GameState.NEXT_ROUND and len(game_rounds) != game_room.rounds):
        print('waiting 3')
        game_room.game_state = schemas.GameState.WAITING
    elif (len(game_rounds) == game_room.rounds):
        print('finished')
        game_room.game_state = schemas.GameState.FINISHED
    
    db.commit()
    return get_game_room_state(db=db, game_room_id=game_room_id)

def have_seen_game_logs(db: Session, game_round_id: int):
    game_logs = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round_id).filter(schemas.GameLog.message == schemas.GameMessage.SEEN_SOLUTION).all()
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_round.game_room_id).first()
    user_ids = list({game_log.user_id for game_log in game_logs})

    return len(user_ids) >= game_room.player_number - 1 

def finish_game_room_state(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None

    game_room.game_state = schemas.GameState.FINISHED
    db.commit()
    return game_room

def send_game_log(db: Session, game_room_id: int, user_id: int, message: schemas.GameMessage):
    db_game_message = schemas.GameLog(
        message=message,
        game_room_id=game_room_id,
        user_id=user_id
    )
    db.add(db_game_message)
    db.commit()
    return db_game_message

def send_next_round_log(db: Session, user_id: int, game_room_id: int = None, game_round_id: int = None):
    game_room_to_log = get_game_room(db, game_room_id)

    if game_room_to_log is None:
        game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
        game_room_to_log = get_game_room(db, game_round.game_room_id)

    db_game_log = schemas.GameLog(
        game_round_id=game_round_id,
        message=schemas.GameMessage.NEXT_ROUND,
        game_room_id=game_room_to_log.id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def send_enter_game_log(db: Session, game_room_id: int, user_id: int):
    game_room_to_log = get_game_room(db, game_room_id)

    if game_room_to_log is None:
        raise ValueError("Game room does not exist.")

    if (game_room_to_log.player_1_id != user_id and game_room_to_log.player_2_id != user_id and game_room_to_log.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    db_game_log = schemas.GameLog(
        message=schemas.GameMessage.ENTER,
        game_room_id=game_room_id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def send_leave_game_log(db: Session, game_room_id: int, user_id: int):
    game_room_to_log = get_game_room(db, game_room_id)

    if game_room_to_log is None:
        raise ValueError("Game room does not exist.")

    if (game_room_to_log.player_1_id != user_id and game_room_to_log.player_2_id != user_id and game_room_to_log.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    db_game_log = schemas.GameLog(
        message=schemas.GameMessage.LEAVE,
        game_room_id=game_room_id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def send_start_game_log(db: Session, user_id: int, game_round_id: int = None,  game_room_id: int = None):
    game_room_to_log = get_game_room(db, game_room_id)

    if (game_room_to_log is None):
        game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
        game_room_to_log = get_game_room(db, game_round.game_room_id)

    if game_room_to_log is None and game_round_id is None:
        raise ValueError("Game room does not exist.")
    
    if (game_room_to_log.player_1_id != user_id and game_room_to_log.player_2_id != user_id and game_room_to_log.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    if (game_room_id is None):
        game_room_id = get_game_round(db, game_round_id).game_room_id

    db_game_log = schemas.GameLog(
        game_round_id=game_round_id,
        message=schemas.GameMessage.START,
        game_room_id=game_room_id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def send_pass_round_log(db: Session, game_round_id: int, game_room_id: int, user_id: int, auto: bool = False):
    game_room_to_log = get_game_room(db, game_room_id)
    game_room_to_log.game_state = schemas.GameState.PASS_ROUND

    if game_room_to_log is None:
        game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
        game_room_to_log = get_game_room(db, game_round.game_room_id)

    if game_room_to_log is None:
        raise ValueError("Game room does not exist.")

    if (game_room_to_log.player_1_id != user_id and game_room_to_log.player_2_id != user_id and game_room_to_log.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    if (game_round_id is None):
        game_round = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()
        game_round_id = game_round.id

    message = schemas.GameMessage.PASS
    if (auto):
        message = schemas.GameMessage.AUTO_PASS
    
    db_game_log = schemas.GameLog(
        game_round_id=game_round_id,
        message=message,
        game_room_id=game_room_id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def send_finish_game_log(db: Session, user_id: int, game_round_id: int = None, game_room_id: int = None):
    game_room_to_log = get_game_room(db, game_room_id)

    if game_room_to_log is None:
        game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
        game_room_to_log = get_game_room(db, game_round.game_room_id)

    if game_room_to_log is None:
        raise ValueError("Game room does not exist.")

    if (game_room_to_log.player_1_id != user_id and game_room_to_log.player_2_id != user_id and game_room_to_log.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    if (game_round_id is None):
        game_round = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()
        game_round_id = game_round.id

    db_game_log = schemas.GameLog(
        game_round_id=game_round_id,
        message=schemas.GameMessage.END,
        game_room_id=game_room_id,
        user_id=user_id
    )

    db.add(db_game_log)
    db.commit()
    return db_game_log

def send_seen_solution_log(db: Session, user_id: int, game_round_id: int):
    game_round = get_game_round(db, game_round_id)
    game_room = get_game_room(db, game_round.game_room_id)

    if game_room is None:
        raise ValueError("Game room does not exist.")

    if (game_room.player_1_id != user_id and game_room.player_2_id != user_id and game_room.player_3_id != user_id):
        raise ValueError("User is not in the game room.")

    db_game_log = schemas.GameLog(
        game_round_id=game_round_id,
        message=schemas.GameMessage.SEEN_SOLUTION,
        game_room_id=game_room.id,
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

def can_pass_round(db: Session, game_round_id: int, user_id: int):
    user = get_user(db, user_id)
    game_round = get_game_round(db, game_round_id)
    game_room = get_game_room(db, game_round.game_room_id)
    game_logs = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round_id).filter(schemas.GameLog.message == schemas.GameMessage.PASS).filter(schemas.GameLog.user_id == user_id).all()
    
    print('comparison:', len(game_logs), game_room.player_number - 1)
    if (len(game_logs) > 0 and len(game_logs) == game_room.player_number - 1):
        return False
    
    if (len(game_logs) <= 0):
        return True
    
def can_user_pass_round_auto(db: Session, game_room_id: int, game_round_id: int):
    game_room = get_game_room(db, game_room_id)
    game_logs = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round_id).filter(schemas.GameLog.message == schemas.GameMessage.AUTO_PASS).all()
    users = {log.user_id for log in game_logs}

    if (len(users) == game_room.player_number):
        return False
        
    return True
    
def pass_round(db: Session, game_round_id: int):
    game_round_to_pass = get_game_round(db, game_round_id)
    game_room = get_game_room(db, game_round_to_pass.game_room_id)

    old_user = game_round_to_pass.user_id

    new_user = get_next_player(db=db, game_room_id=game_round_to_pass.game_room_id, last_user=old_user)

    if game_round_to_pass is None:
        return None
    
    game_round_to_pass.user_id = new_user
    game_room.game_state = schemas.GameState.PASS_ROUND
    db.commit()
    return game_round_to_pass

def finish_game_room(db: Session, game_room_id: int):
    game_room_to_close = get_game_room(db, game_room_id)

    if game_room_to_close is None:
        return None

    game_room_to_close.game_state = schemas.GameState.FINISHED
    db.commit()
    return game_room_to_close

def get_next_player(db: Session, game_room_id: int, last_user: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None
    
    if (game_room.player_number == 3):
        if (game_room.player_1_id == last_user):
            return game_room.player_2_id
        elif (game_room.player_2_id == last_user):
            return game_room.player_3_id
        elif (game_room.player_3_id == last_user):
            return game_room.player_1_id
        
        return random.choice([game_room.player_1_id, game_room.player_2_id, game_room.player_3_id])
    else: 
        if (game_room.player_1_id == last_user):
            return game_room.player_2_id
        elif (game_room.player_2_id == last_user):
            return game_room.player_1_id
        
        return random.choice([game_room.player_1_id, game_room.player_2_id])
      
def get_attempt_by_round_id(db: Session, game_round_id: int):
    return db.query(schemas.Attempt).filter(schemas.Attempt.game_round_id == game_round_id).order_by(schemas.Attempt.id.desc()).first()

def get_round_solution(db: Session, game_round_id: int):
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
    attempt = get_attempt_by_round_id(db, game_round_id)

    return attempt

def get_users_in_game_room(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None

    users = []

    if (game_room.player_1_id is not None):
        users.append(game_room.player_1_id)
    if (game_room.player_2_id is not None):
        users.append(game_room.player_2_id)
    if (game_room.player_3_id is not None):
        users.append(game_room.player_3_id)

    return users

def add_game_round(db: Session, game_room_id: int, challenge_id: int):
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()
    next_user = get_next_player(db=db, game_room_id=game_room_id, last_user=game_round.user_id if game_round is not None else None)
    game_room = get_game_room(db, game_room_id)
    
    if (game_room.game_state == schemas.GameState.FINISHED):
        return None

    if (game_round is not None):
        attempt = get_attempt_by_round_id(db, game_round.id)
        pass_messages = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round.id).filter(schemas.GameLog.message == schemas.GameMessage.PASS or schemas.GameLog.message == schemas.GameMessage.AUTO_PASS).all()
    
        if (pass_messages is not None):
            users_who_passed = list({log.user_id for log in pass_messages})
            users_who_passed = sorted(users_who_passed)

        if (game_round.state == schemas.GameRoundState.FINISHED):
            print('game round found was already finished')
        elif (game_round.state == schemas.GameRoundState.ONGOING or attempt is None):
            print('ongoing game round')

            if (sorted(users_who_passed) == sorted(get_users_in_game_room(db, game_room_id)) and (not game_round.all_passed)):
                print('all have passed')
                game_round.player_id = game_round.first_chosen
                game_round.all_passed = True
                db.commit()
                return game_round
            else:
                print('not all have passed')
                return game_round

    game_room = get_game_room(db, game_room_id)

    if game_round is None:
        round_number = 1
    elif (game_round.round_number + 1 <= game_room.rounds):
        round_number = game_round.round_number + 1
    else:
        print('finished game room')
        db_game_round = schemas.GameRound(
        game_room_id=game_room_id,
        user_id=next_user,
        challenge_id=challenge_id,
        round_number=-1,
        max_rounds=game_room.rounds,
        state=schemas.GameRoundState.FINISHED,
        first_chosen=next_user,
        all_passed=False
        )
        db.commit()
        return db_game_round

    db_game_round = schemas.GameRound(
        game_room_id=game_room_id,
        user_id=next_user,
        challenge_id=challenge_id,
        round_number=round_number,
        max_rounds=game_room.rounds,
        state=schemas.GameRoundState.ONGOING,
        first_chosen=next_user,
        all_passed=False
    )
    db.add(db_game_round)
    db.commit()
    return db_game_round

def get_players(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None

    players = []

    if (game_room.player_1_id is not None):
        players.append(game_room.player_1_id)
    if (game_room.player_2_id is not None):
        players.append(game_room.player_2_id)
    if (game_room.player_3_id is not None):
        players.append(game_room.player_3_id)

    return players

def finish_game_round(db: Session, game_round_id: int):
    print('finish game round')
    game_round_to_finish = db.query(schemas.GameRound).filter(
        schemas.GameRound.id == game_round_id).first()
    game_room = get_game_room(db, game_round_to_finish.game_room_id)

    if game_round_to_finish is None:
        return None

    game_round_to_finish.state = schemas.GameRoundState.FINISHED

    db.commit()
    return game_round_to_finish

def finish_all_passed_game_round(db: Session, game_round_id: int):
    
    game_round_to_finish = db.query(schemas.GameRound).filter(
        schemas.GameRound.id == game_round_id).first()
    game_room = get_game_room(db, game_round_to_finish.game_room_id)

    if game_round_to_finish is None:
        return None
    
    if game_round_to_finish.all_passed is False:
        return None

    game_round_to_finish.state = schemas.GameRoundState.FINISHED

    db.commit()
    print('finish game round (all passed)')
    return game_round_to_finish

def get_winner(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return []

    game_rounds = db.query(schemas.GameRound).filter(
        schemas.GameRound.game_room_id == game_room_id).all()

    if (game_room.game_winner_1_id is not None):
        return game_room.game_winner_1_id

    if (game_room.game_state == schemas.GameState.FINISHED):
        player_scores = {}
        for round in game_rounds:
            if round.state == schemas.GameRoundState.FINISHED:
                attempt = get_attempt_by_round_id(db, round.id)
                if attempt is not None:
                    if attempt.player_id not in player_scores:
                        player_scores[attempt.player_id] = attempt.score
                    else:
                        player_scores[attempt.player_id] += attempt.score
                

        winner_id = max(player_scores, key=player_scores.get)
        winner = []

        for key, value in player_scores.items():
            if value == player_scores[winner_id]:
                winner.append(key)

        if (winner != []):
            game_room.game_winner_1 = winner[0] if len(winner) > 0 else None
            game_room.game_winner_2 = winner[1] if len(winner) > 1 else None
            game_room.game_winner_3 = winner[2] if len(winner) > 2 else None
            db.commit()
        else:
            return []

        if len(winner) > 2:
            result = [get_user_basics(db, winner[0]), get_user_basics(db, winner[1]), get_user_basics(db, winner[2])]
        elif len(winner) > 1:
            result = [get_user_basics(db, winner[0]), get_user_basics(db, winner[1])]
        else:
            result = [get_user_basics(db, winner[0])]

        return result 

    return []

def get_game_results(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None

    game_rounds = db.query(schemas.GameRound).filter(
        schemas.GameRound.game_room_id == game_room_id).filter(schemas.GameRound.state == schemas.GameRoundState.FINISHED).all()

    results = []

    for round in game_rounds:
        attempt = get_attempt_by_round_id(db, round.id)
        if attempt is not None:
            results.append(
                {
                    "round_id": round.id,
                    "player_id": attempt.player_id,
                    "score": attempt.score,
                    "challenge": get_challenge(db, round.challenge_id).name,
                    "all_passed": False
                }
            )
        elif round.all_passed:
            results.append(
                {
                    "round_id": round.id,
                    "player_id": round.user_id,
                    "score": 0,
                    "challenge": get_challenge(db, round.challenge_id).name,
                    "all_passed": True
                }
            )

    results.sort(key=lambda x: x['round_id'])

    return results

def get_code_file_dictionary(db: Session):
    entries = db.query(schemas.CodeFileDictionary).all()
    result = {}

    for entry in entries:
        result[entry.expression] = entry.replacement

    return result

def get_user_attempts(db: Session, user_id: int):
    return db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).all()

def get_non_validated_users(db: Session):
    return db.query(schemas.User).filter(schemas.User.validated == False).all()

def validate_user(db: Session, user_id: int):
    user_to_validate = get_user(db, user_id)

    if user_to_validate is None:
        return None

    user_to_validate.validated = True
    db.commit()
    return user_to_validate

def get_passed_attempts_comments(db: Session, challenge_id: int):
    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.challenge_id == challenge_id).filter(schemas.Attempt.attempt_type == "pass").all()
    comments = []

    for attempt in attempts:
        comments.append({
            "comment": attempt.comment,
            "comment_score": attempt.comment_score,
            "attempt_id": attempt.id,
            "challenge_id": attempt.challenge_id
        })

    return comments

def add_comment_score(db: Session, attempt_id: int, given_score: int):
    attempt = db.query(schemas.Attempt).filter(schemas.Attempt.id == attempt_id).first()

    if attempt is None or attempt.comment_score is None or attempt.comment_score_count is None:
        return None

    current_sum = attempt.comment_score * attempt.comment_score_count
    attempt.comment_score_count += 1
    attempt.comment_score = round((current_sum + given_score) / attempt.comment_score_count, 2)
    db.commit()

    attempt_score = schemas.AttemptScore(
        challenge_id=attempt.challenge_id,
        attempt_id=attempt_id,
        user_id=attempt.player_id,
        given_score=given_score
    )

    return attempt_score

def create_attempt_score(db: Session, attempt_id: int, user_id: int, given_score: int):
    attempt = db.query(schemas.Attempt).filter(schemas.Attempt.id == attempt_id).first()
    user = db.query(schemas.User).filter(schemas.User.id == user_id).first()
    attempt_score = db.query(schemas.AttemptScore).filter(schemas.AttemptScore.attempt_id == attempt_id).filter(schemas.AttemptScore.user_id == user_id).first()

    if attempt is None or user is None or attempt_score is not None:
        return None

    attempt_score = schemas.AttemptScore(
        challenge_id=attempt.challenge_id,
        attempt_id=attempt_id,
        user_id=user_id,
        given_score=given_score,
    )
    db.add(attempt_score)
    db.commit()
    return attempt

def get_user_attempt_scores(db: Session, challenge_id: int, user_id: int):
    return db.query(schemas.AttemptScore).filter(schemas.AttemptScore.challenge_id == challenge_id).filter(schemas.AttemptScore.user_id == user_id).all()

def get_all_attempts_by_challenge(db: Session):
    result = {}

    challenges = db.query(schemas.Challenge).all()
    for challenge in challenges:
        result[challenge.id] = []
        attempts = db.query(schemas.Attempt).filter(schemas.Attempt.challenge_id == challenge.id).all()   
        for attempt in attempts:
            result[challenge.id].append(attempt)

    return result

def get_challenge_titles(db: Session):
    challenges = db.query(schemas.Challenge).all()
    result = {}

    for challenge in challenges:
        result[challenge.id] = challenge.name

    return result

def compare(user1, user2):
    if user1.score < user2.score:
        return 1
    elif user1.score > user2.score:
        return -1
    elif user1.score == user2.score:
        if (user1.successful_attempts < user2.successful_attempts):
            return 1
        elif (user1.successful_attempts > user2.successful_attempts):
            return -1
        elif (user1.successful_attempts == user2.successful_attempts):
            if (user1.achievements < user2.achievements):
                return 1
            elif (user1.achievements > user2.achievements):
                return -1
            elif (user1.achievements == user2.achievements):
                if (user1.failed_attempts < user2.failed_attempts):
                    return -1
                elif (user1.failed_attempts > user2.failed_attempts):
                    return 1
                elif (user1.failed_attempts == user2.failed_attempts):
                    if (user1.successful_attempts + user1.failed_attempts < user2.successful_attempts + user2.failed_attempts):
                        return 1
                    elif (user1.successful_attempts + user1.failed_attempts > user2.successful_attempts + user2.failed_attempts):
                        return -1
                    elif (user1.successful_attempts + user1.failed_attempts == user2.successful_attempts + user2.failed_attempts):
                        return user1.name < user2.name

def get_admin_leaderboard(db: Session):
    users = db.query(schemas.User).all()
    users.sort(key=cmp_to_key(compare))
    result = []

    for user in users:
        result.append(models.UserBasics(
            id=user.id,
            name=user.name,
            email=user.email,
            picture=user.picture,
            username=user.username,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            score=user.score,
            achievements=user.achievements,
            user_type=user.user_type,
            validated=user.validated
        ))

    return result

def get_player_leaderboard(db: Session):
    users = db.query(schemas.User).filter(schemas.User.user_type == schemas.UserType.PLAYER).all()
    users.sort(key=cmp_to_key(compare))
    result = []

    for user in users:
        result.append({
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "picture": user.picture,
            "successful_attempts": user.successful_attempts,
            "achievements": user.achievements,
            "user_type": user.user_type
        })

    return result

