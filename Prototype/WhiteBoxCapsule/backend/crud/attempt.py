from sqlalchemy.orm import Session
from dateutil.relativedelta import *

import schemas

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

def get_all_attempts_by_challenge(db: Session):
    result = {}

    challenges = db.query(schemas.Challenge).all()
    for challenge in challenges:
        result[challenge.id] = []
        attempts = db.query(schemas.Attempt).filter(schemas.Attempt.challenge_id == challenge.id).all()   
        for attempt in attempts:
            result[challenge.id].append(attempt)

    return result

def get_passed_challenges(db: Session, user_id: int):
    passed_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == "pass")
    passed_challenges_ids = [attempt.challenge_id for attempt in passed_attempts]
    passed_challenges_ids = list(set(passed_challenges_ids))
    return passed_challenges_ids

def get_unlocked_challenge_achievements(db: Session, user_id: int):
    achievement_unlocked_attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.achievement == True).filter(schemas.Attempt.attempt_type == "pass")
    unlocked_challenges = [attempt.challenge_id for attempt in achievement_unlocked_attempts]
    unlocked_challenges = list(set(unlocked_challenges))
    return unlocked_challenges

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

def get_user_attempts(db: Session, user_id: int):
    return db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).all()

def get_attempt_by_round_id(db: Session, game_round_id: int):
    return db.query(schemas.Attempt).filter(schemas.Attempt.game_round_id == game_round_id).order_by(schemas.Attempt.id.desc()).first()

def get_round_solution(db: Session, game_round_id: int):
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
    attempt = get_attempt_by_round_id(db, game_round_id)

    return attempt