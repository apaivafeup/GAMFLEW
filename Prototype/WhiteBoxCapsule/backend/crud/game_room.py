from sqlalchemy.orm import Session
from dateutil.relativedelta import *
import random

from crud.attempt import get_attempt_by_round_id
from crud.challenge import get_challenge
from crud.game_round import get_finished_rounds_by_game_room, get_game_round_by_game_room, get_last_finished_round, get_last_passed_round, have_seen_game_logs
from crud.user import get_user_basics
import models
import schemas as schemas


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
    db.delete(game_room_to_delete)
    db.commit()
    return game_room_to_delete

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
        print('waiting 3')
        game_room.game_state = schemas.GameState.WAITING
    elif (game_room.game_state == schemas.GameState.SHOW_SOLUTION and have_seen_game_logs(db=db, game_round_id=game_round.id)):
        print('next round 1')
        game_room.game_state = schemas.GameState.NEXT_ROUND
    elif (game_round is not None and game_round.state == schemas.GameRoundState.FINISHED and game_room.game_state != schemas.GameState.NEXT_ROUND and len(game_rounds) != game_room.rounds):
        print('show solution 1')
        game_room.game_state = schemas.GameState.SHOW_SOLUTION
    elif (game_room.game_state == schemas.GameState.NEXT_ROUND):
        print('waiting 2')
        game_room.game_state = schemas.GameState.WAITING
    elif (len(game_rounds) == game_room.rounds):
        print('finished')
        game_room.game_state = schemas.GameState.FINISHED
    
    db.commit()
    return get_game_room_state(db=db, game_room_id=game_room_id)

def finish_game_room_state(db: Session, game_room_id: int):
    game_room = get_game_room(db, game_room_id)

    if game_room is None:
        return None

    game_room.game_state = schemas.GameState.FINISHED
    db.commit()
    return game_room

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
                    "challenge": get_challenge(db, round.challenge_id).name
                }
            )

    results.sort(key=lambda x: x['round_id'])

    return results