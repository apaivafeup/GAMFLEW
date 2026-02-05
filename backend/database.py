from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Create a connection string
TECH = os.environ.get('DB_TECH', 'postgresql')
USERNAME = os.environ.get('DB_USERNAME', 'postgres')
PASSWORD = os.environ.get('DB_PASSWORD', 'password')
HOST = os.environ.get('DB_HOST', 'database')  # Default to service name
DATABASE = os.environ.get('DB_DATABASE', 'prototype')
PORT = int(os.environ.get('DB_PORT', 5432))

SQLALCHEMY_DATABASE_URL = f"{TECH}://{USERNAME}:%s@{HOST}:{PORT}/{DATABASE}" % quote(PASSWORD)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
