"""
Initialize database
"""
from database import engine, SessionLocal
from schemas import Base

def init_db():
    """
    Initiates the database
    """

    print("Creating DB")

    Base.metadata.create_all(bind=engine)

def get_db():
    """
    Yields a DB session via generator.

    Yields:
        db: A DB Session
    """
    with SessionLocal() as db:
        yield db