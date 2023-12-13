from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv   #for python-dotenv method
import os

local = True

load_dotenv()

# Create a connection string
TECH = 'postgresql' if local else os.environ.get('TECH')
USERNAME = 'postgres' if local else os.environ.get('USERNAME')
PASSWORD = 'password' if local else os.environ.get('PASSWORD')
HOST = 'localhost' if local else os.environ.get('HOST')
DATABASE = 'prototype' if local else os.environ.get('DATABASE')

SQLALCHEMY_DATABASE_URL = f"{TECH}://{USERNAME}:%s@{HOST}/{DATABASE}" % quote(PASSWORD)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

