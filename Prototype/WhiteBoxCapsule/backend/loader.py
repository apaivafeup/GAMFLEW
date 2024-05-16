"""
Load data into the database
"""
from typing import List
from pydantic import BaseModel

import models 
import crud
from database import SessionLocal

create_op = {
    str(models.User): crud.create_user,
    str(models.CodeFile): crud.create_code_file,
    str(models.BoardState): crud.create_board_state,
    str(models.Challenge): crud.create_challenge,
    str(models.Attempt): crud.create_attempt,
    str(models.GameRoom): crud.create_game_room,
    str(models.CodeFileDictionary): crud.create_code_file_dictionary,
    str(models.GeneralAchievement): crud.create_general_achievement,
}

def load_data(entries: List[BaseModel]) -> None:
    """
    Loads the pydantic objects in the argument to the database.
    """
    for entry in entries:
        with SessionLocal.begin() as db:
            create_op[str(type(entry))](db, entry)

def load_data_best_effort(entries: List[BaseModel]) -> None:
    """
    Loads the pydantic objects in the argument to the database. Catches errors thrown during database operations
    """
    for entry in entries:
        try:
            with SessionLocal.begin() as db:
                create_op[str(type(entry))](db, entry)
        except Exception as error: 
            print(error)           

if __name__ == '__main__':
    print('This script cannot be directly invoked')