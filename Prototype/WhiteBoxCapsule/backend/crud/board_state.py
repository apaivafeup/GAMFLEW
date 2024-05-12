from sqlalchemy.orm import Session
from dateutil.relativedelta import *

import schemas

def create_board_state(db: Session, board_state: schemas.BoardState):
    db_board_state = schemas.BoardState(
        name=board_state.name,
        board_state=board_state.board_state,
        out_of_bounds_state=board_state.out_of_bounds_state
    )
    db.add(db_board_state)
    db.commit()
    return db_board_state

def get_board_states(db: Session):
    return db.query(schemas.BoardState).all()

def get_board_state(db: Session, board_state_id: int):
    return db.query(schemas.BoardState).filter(schemas.BoardState.id == board_state_id).first()