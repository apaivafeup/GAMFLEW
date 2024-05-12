from sqlalchemy.orm import Session
from dateutil.relativedelta import *

import schemas

def create_code_file_dictionary(db: Session, code_file_dictionary: schemas.CodeFileDictionary):
    db_code_file_dictionary = schemas.CodeFileDictionary(
            expression=code_file_dictionary.expression,
            replacement=code_file_dictionary.replacement
    )
    db.add(db_code_file_dictionary)
    db.commit()
    return db_code_file_dictionary

def get_code_file_dictionary(db: Session):
    entries = db.query(schemas.CodeFileDictionary).all()
    result = {}

    for entry in entries:
        result[entry.expression] = entry.replacement

    return result