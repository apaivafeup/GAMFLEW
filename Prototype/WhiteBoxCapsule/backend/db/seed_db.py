"""
Seed database with mock data
"""
import json

import backend.db.models as models
import loader

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models_entries = [
    (models.user.User, './mock/users.json'),
    (models.challenge.Challenge, './mock/challenges.json'),
    (models.attempt.Attempt, './mock/attempts.json'),
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
                entries.append(model.parse_obj(entry))
        loader.load_data_best_effort(entries)

if __name__ == '__main__':
    logger.info("Seeding database")
    main()