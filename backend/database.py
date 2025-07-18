from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv('.env')

# Create a connection string
TECH = os.environ.get('DB_TECH')
USERNAME = os.environ.get('DB_USERNAME')
PASSWORD = os.environ.get('DB_PASSWORD')
HOST = os.environ.get('DB_HOST')  # Default to service name
DATABASE = os.environ.get('DB_DATABASE')
PORT = os.environ.get('DB_PORT')  # Keep as string for connection string

if not all([TECH, USERNAME, PASSWORD, HOST, DATABASE, PORT]):
	raise ValueError("One or more required database environment variables are missing.")

SQLALCHEMY_DATABASE_URL = f"{TECH}://{USERNAME}:{quote(PASSWORD)}@{HOST}:{PORT}/{DATABASE}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
