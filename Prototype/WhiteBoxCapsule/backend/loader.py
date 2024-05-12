"""
Load data into the database
"""
from typing import List
from pydantic import BaseModel

import models 
import crud.token as token
import crud.user as user
import crud.code_file as code_file
import crud.board_state as board_state
import crud.challenge as challenge
import crud.attempt as attempt
import crud.game_room as game_room
import crud.code_file_dictionary as code_file_dictionary
from database import SessionLocal

create_op = {
    str(models.User): user.create_user,
    str(models.CodeFile): code_file.create_code_file,
    str(models.BoardState): board_state.create_board_state,
    str(models.Challenge): challenge.create_challenge,
    str(models.Attempt): attempt.create_attempt,
    str(models.GameRoom): game_room.create_game_room,
    str(models.CodeFileDictionary): code_file_dictionary.create_code_file_dictionary,
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