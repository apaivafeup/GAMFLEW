"""
Create schemas on the database
"""

from db_op import init_db
import schemas_references

def init():
    try:
        init_db()
    finally:
        pass

def main():
    init()

if __name__ == "__main__":
    print('Schemas definition')