from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv   #for python-dotenv method
import os

load_dotenv()

local = eval(os.environ.get('LOCAL'))

# Create a connection string
TECH = 'postgresql' if local else os.environ.get('TECH')
USERNAME = 'postgres' if local else 'feupptgamflew'
PASSWORD = 'password' if local else os.environ.get('PASSWORD')
HOST = 'localhost' if local else os.environ.get('HOST')
DATABASE = 'prototype' if local else os.environ.get('DATABASE')

if True:
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@database:5432/prototype"
else:
    SQLALCHEMY_DATABASE_URL = f"{TECH}://{USERNAME}:%s@{HOST}/{DATABASE}" % quote(PASSWORD)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

