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

models_entries = [
    (models.User, "./mock/teachers.json"),
    (models.StudentClass, "./mock/student_class.json"),
    (models.User, "./mock/students.json"),
    (models.CodeFile, "./mock/code_files.json"),
    (models.BoardState, "./mock/board_states.json"),
    (models.Challenge, "./mock/challenges.json"),
    (models.StudentClassChallenge, "./mock/student_class_challenge.json"),	
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