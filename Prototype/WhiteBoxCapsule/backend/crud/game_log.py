from sqlalchemy.orm import Session
from dateutil.relativedelta import *

from crud.game_room import get_game_room
from crud.game_round import get_game_round
import schemas


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