from database import engine
from sqlalchemy import MetaData

MAX_TRIES = 60 * 5  # 5 minutes
WAIT_SECONDS = 1

def clear_db():
    """
    Clears the database
    """
    metadata = MetaData()
    metadata.reflect(bind=engine)
    metadata.drop_all(bind=engine)
    print("Database cleared")

def main():
    """
    Main calls the function clear_db()
    """
    clear_db()

if __name__ == "__main__":
    main()