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
    (models.User, "./backend/db/mock/users.json"),
    (models.CodeFile, "./backend/db/mock/code_files.json"),
    (models.BoardState, "./backend/db/mock/board_states.json"),
    (models.Challenge, "./backend/db/mock/challenges.json"),
    (models.Attempt, "./backend/db/mock/attempts.json"),
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