"""
Seed database with mock data
"""
import os
import json

import models
import loader

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

challenges = "./mock/challenges.json"

models_entries = [
    (models.User, "./mock/users.json"),
    (models.CodeFile, "./mock/code_files.json"),
    (models.BoardState, "./mock/board_states.json"),
    (models.Challenge, challenges),
    (models.Attempt, "./mock/attempts.json"),
    (models.GameRoom, "./mock/game_rooms.json"),
    (models.CodeFileDictionary, "./mock/code_file_dictionary.json"),
    (models.GeneralAchievement, "./mock/general_achievements.json"),
]
 
def main():
    """
    Read Json files with data to seed the database
    """
    for model, file in models_entries:
        entries = []
        with open(file, encoding='utf8') as json_file:
            data = json.load(json_file)
            for entry in data:
                entries.append(model.model_validate(entry))
        loader.load_data_best_effort(entries)

if __name__ == '__main__':
    logger.info("Seeding database")
    main()