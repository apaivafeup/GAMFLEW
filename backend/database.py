from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv   #for python-dotenv method
import os

load_dotenv()

#local = eval(os.environ.get('LOCAL'))
is_docker = os.path.exists('/.dockerenv') 

# Create a connection string
TECH = 'postgresql' #if local else os.environ.get('TECH')
USERNAME = 'postgres' #if local else 'feupptgamflew'
PASSWORD = 'password' #if local else os.environ.get('PASSWORD')
HOST = 'host.docker.internal' #if (is_docker and local) else '127.0.0.1' if local else os.environ.get('HOST')
DATABASE = 'prototype' #if local else os.environ.get('DATABASE')
PORT = 5432

SQLALCHEMY_DATABASE_URL = f"{TECH}://{USERNAME}:%s@{HOST}:{PORT}/{DATABASE}" % quote(PASSWORD)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

