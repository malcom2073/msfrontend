
import os

DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_DATABASE = os.getenv('DB_DATABASE')
SECRET_KEY = os.getenv('BACKEND_SECRET_KEY')
#SQLALCHEMY_DATABASE_URI = 'sqlite:///test.sqlite3'
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://' + DB_USER + ':' + DB_PASS + '@' + DB_HOST + '/'+ DB_DATABASE

# Used for in-memory database
#SQLALCHEMY_DATABASE_URI = 'sqlite://'
