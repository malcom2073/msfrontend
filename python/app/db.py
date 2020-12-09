from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import config

engine = create_engine(config.SQLALCHEMY_DATABASE_URI, echo = False)
Session = sessionmaker(bind = engine)
session = Session() # Only valid in the main application thread!
Model = declarative_base()