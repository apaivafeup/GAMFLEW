from sqlalchemy.orm import Session
from dateutil.relativedelta import *

from crud.attempt import get_attempt_by_round_id
from crud.user import get_user
import schemas

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

def have_seen_game_logs(db: Session, game_round_id: int):
    game_logs = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round_id).filter(schemas.GameLog.message == schemas.GameMessage.SEEN_SOLUTION).all()
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.id == game_round_id).first()
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_round.game_room_id).first()
    return len(game_logs) >= game_room.player_number - 1 # All players have seen the solution

def can_pass_round(db: Session, game_round_id: int, user_id: int):
    user = get_user(db, user_id)
    game_round = get_game_round(db, game_round_id)
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_round.game_room_id).first()
    game_logs = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round_id).filter(schemas.GameLog.message == schemas.GameMessage.PASS).filter(schemas.GameLog.user_id == user_id).all()
    
    print('comparison:', len(game_logs), game_room.player_number - 1)
    if (len(game_logs) > 0 and len(game_logs) == game_room.player_number - 1):
        return False
    
    if (len(game_logs) <= 0):
        return True
    
def can_user_pass_round_auto(db: Session, game_room_id: int, game_round_id: int):
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_room_id).first()
    game_logs = db.query(schemas.GameLog).filter(schemas.GameLog.game_round_id == game_round_id).filter(schemas.GameLog.message == schemas.GameMessage.AUTO_PASS).all()
    users = {log.user_id for log in game_logs}

    if (len(users) == game_room.player_number):
        return False
        
    return True
    
def pass_round(db: Session, game_round_id: int):
    game_round_to_pass = get_game_round(db, game_round_id)
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_round_to_pass.game_room_id).first()

    old_user = game_round_to_pass.user_id

    new_user = get_next_player(db=db, game_room_id=game_round_to_pass.game_room_id, last_user=old_user)

    if game_round_to_pass is None:
        return None
    
    game_round_to_pass.user_id = new_user
    game_room.game_state = schemas.GameState.PASS_ROUND
    db.commit()
    return game_round_to_pass

def add_game_round(db: Session, game_room_id: int, challenge_id: int):
    game_round = db.query(schemas.GameRound).filter(schemas.GameRound.game_room_id == game_room_id).order_by(schemas.GameRound.id.desc()).first()
    next_user = get_next_player(db=db, game_room_id=game_room_id, last_user=game_round.user_id if game_round is not None else None)
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_room_id).first()

    if (game_room.game_state == schemas.GameState.FINISHED):
        return None

    if (game_round is not None):
        attempt = get_attempt_by_round_id(db, game_round.id)

        if (game_round.state == schemas.GameRoundState.ONGOING or attempt is None):
            print('ongoing game round')
            return game_round

    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_room_id).first()

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
        state=schemas.GameRoundState.FINISHED
        )
        return db_game_round

    db_game_round = schemas.GameRound(
        game_room_id=game_room_id,
        user_id=next_user,
        challenge_id=challenge_id,
        round_number=round_number,
        max_rounds=game_room.rounds,
        state=schemas.GameRoundState.ONGOING
    )
    db.add(db_game_round)
    db.commit()
    return db_game_round

def finish_game_round(db: Session, game_round_id: int):
    print('finish game round')
    game_round_to_finish = db.query(schemas.GameRound).filter(
        schemas.GameRound.id == game_round_id).first()
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_round_to_finish.game_room_id).first()

    if game_round_to_finish is None:
        return None

    game_round_to_finish.state = schemas.GameRoundState.FINISHED

    db.commit()
    return game_round_to_finish

def get_next_player(db: Session, game_room_id: int, last_user: int):
    game_room = db.query(schemas.GameRoom).filter(schemas.GameRoom.id == game_room_id).first()

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