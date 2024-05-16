import json
import schemas
import models
from sqlalchemy.orm import Session


def grant_general_achievement(db: Session, user_id: int, general_achievement_id: int):
    db.add(models.UserGeneralAchievement(user_id=user_id, general_achievement_id=general_achievement_id))
    db.commit()

def check_achievements(db: Session, user_id: int):
    check_achievement_1(db, user_id)
    check_achievement_2(db, user_id)
    check_achievement_3(db, user_id)
    check_achievement_4(db, user_id)
    check_achievement_5(db, user_id)
    check_achievement_6(db, user_id)
    check_achievement_7(db, user_id)
    check_achievement_8(db, user_id)
    check_achievement_9(db, user_id)
    check_achievement_10(db, user_id)
    check_achievement_11(db, user_id)
    check_achievement_12(db, user_id)

def check_achievement_1(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 1).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(1, 19)]

    if len(attempts) == 18:
        grant_general_achievement(db, user_id, 1)

def check_achievement_2(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 2).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(19, 34)]

    if len(attempts) == 15:
        grant_general_achievement(db, user_id, 2)

def check_achievement_3(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 3).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(34, 49)]

    if len(attempts) == 15:
        grant_general_achievement(db, user_id, 3)

def check_achievement_4(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 4).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(49, 58)]

    if len(attempts) == 9:
        grant_general_achievement(db, user_id, 4)

def check_achievement_5(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 5).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(58, 73)]

    if len(attempts) == 15:
        grant_general_achievement(db, user_id, 5)

def check_achievement_6(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 6).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(73, 87)]

    if len(attempts) == 14:
        grant_general_achievement(db, user_id, 6)

def check_achievement_7(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 7).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    attempts = [challenge_id for challenge_id in attempts if challenge_id in range(87, 100)]

    if len(attempts) == 13:
        grant_general_achievement(db, user_id, 7)

def check_achievement_8(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 8).first()

    if general_achievement is not None:
        return

    attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).all()
    
    for a in attempts:
        challenge = db.query(schemas.Challenge).filter(schemas.Challenge.id == a.challenge_id).first()

        if challenge.challenge_type != schemas.ChallengeType.STATEMENT:
            continue

        test_cases = a.test_cases

        if len(test_cases['0']['log']) == 0:
            grant_general_achievement(db, user_id, 8)
            break

def check_achievement_9(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 9).first()

    if general_achievement is not None:
        return

    for i in range(1, 100):
        attempts = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.challenge_id == i).all()
        types = set([a.attempt_type for a in attempts])

        if len(types) == 2:
            pass_attempt = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.challenge_id == i).filter(schemas.Attempt.attempt_type == schemas.AttemptType.PASS).order_by(schemas.Attempt.id.desc()).first()
            fail_attempt = db.query(schemas.Attempt).filter(schemas.Attempt.player_id == user_id).filter(schemas.Attempt.challenge_id == i).filter(schemas.Attempt.attempt_type == schemas.AttemptType.FAIL).order_by(schemas.Attempt.id.desc()).first()

            if pass_attempt.id > fail_attempt.id:
                grant_general_achievement(db, user_id, 9)
                break

def check_achievement_10(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 10).first()

    if general_achievement is not None:
        return

    game_rooms = db.query(schemas.GameRoom).filter(schemas.GameRoom.player_1_id == user_id or schemas.GameRoom.player_2_id == user_id or schemas.GameRoom.player_3_id == user_id).filter(schemas.GameRoom.game_state == schemas.GameState.FINISHED).all()

    if (len(game_rooms) > 0):
        grant_general_achievement(db, user_id, 10)

def check_achievement_11(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 11).first()

    if general_achievement is not None:
        return

    game_rooms = db.query(schemas.GameRoom).filter(schemas.GameRoom.game_winner_1_id == user_id or schemas.GameRoom.game_winner_2_id == user_id or schemas.GameRoom.game_winner_3_id == user_id).all()

    if (len(game_rooms) > 0):
        grant_general_achievement(db, user_id, 11)

def check_achievement_12(db: Session, user_id: int):
    general_achievement = db.query(models.UserGeneralAchievement).filter(models.UserGeneralAchievement.user_id == user_id).filter(models.UserGeneralAchievement.general_achievement_id == 12).first()

    if general_achievement is not None:
        return

    game_rooms = db.query(schemas.GameRoom).filter(
        schemas.GameRoom.player_1_id == user_id or
        schemas.GameRoom.player_2_id == user_id or
        schemas.GameRoom.player_3_id == user_id
    ).filter(schemas.GameRoom.game_state == schemas.GameState.FINISHED).filter(
        schemas.GameRoom.game_winner_1_id != user_id or
        schemas.GameRoom.game_winner_2_id != user_id or
        schemas.GameRoom.game_winner_3_id != user_id
    ).all()

    if (len(game_rooms) > 0):
        grant_general_achievement(db, user_id, 12)




