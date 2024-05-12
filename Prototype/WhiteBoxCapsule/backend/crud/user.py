from sqlalchemy.orm import Session


from crud.attempt import get_passed_challenges
from crud.challenge import get_challenge
import models
import schemas
import auth

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
    achievements = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.achievement == True).count()

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

def get_non_validated_users(db: Session):
    return db.query(schemas.User).filter(schemas.User.validated == False).all()

def validate_user(db: Session, user_id: int):
    user_to_validate = get_user(db, user_id)

    if user_to_validate is None:
        return None

    user_to_validate.validated = True
    db.commit()
    return user_to_validate