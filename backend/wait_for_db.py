
import time
import psycopg2
import os
from urllib.parse import quote

def wait_for_db():
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Database connection parameters
            host = os.environ.get('DB_HOST', 'database')
            port = int(os.environ.get('DB_PORT', 5432))
            database = os.environ.get('DB_DATABASE', 'prototype')
            username = os.environ.get('DB_USERNAME', 'postgres')
            password = os.environ.get('DB_PASSWORD', 'password')
            
            # Try to connect
            conn = psycopg2.connect(
                host=host,
                port=port,
                database=database,
                user=username,
                password=password
            )
            conn.close()
            print("Database is ready!")
            return True
            
        except psycopg2.OperationalError as e:
            retry_count += 1
            print(f"Database not ready yet, retrying... ({retry_count}/{max_retries})")
            print(f"Error: {e}")
            time.sleep(2)
    
    print("Failed to connect to database after maximum retries")
    return False

if __name__ == "__main__":
    if wait_for_db():
        exit(0)
    else:
        exit(1)
