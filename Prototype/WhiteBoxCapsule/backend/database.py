from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv   #for python-dotenv method
import os

load_dotenv()

local = eval(os.environ.get('LOCAL'))

# Create a connection string
TECH = os.environ.get('TECH')
USERNAME = 'feupptgamflew'
PASSWORD = os.environ.get('PASSWORD')
HOST = os.environ.get('HOST')
DATABASE = os.environ.get('DATABASE')

SQLALCHEMY_DATABASE_URL = f"{TECH}://{USERNAME}:%s@{HOST}/{DATABASE}" % quote(PASSWORD)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

