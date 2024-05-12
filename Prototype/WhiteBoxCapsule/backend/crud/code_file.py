from sqlalchemy.orm import Session
from dateutil.relativedelta import *

import schemas

def create_code_file(db: Session, code_file: schemas.CodeFile):
    db_code_file = schemas.CodeFile(
        name=code_file.name,
        content=code_file.content
    )
    db.add(db_code_file)
    db.commit()
    return db_code_file

def get_code_files(db: Session):
    return db.query(schemas.CodeFile).all()

def get_code_file(db: Session, code_file_id: int):
    return db.query(schemas.CodeFile).filter(schemas.CodeFile.id == code_file_id).first()