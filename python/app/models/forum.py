#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
#from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Column, Integer, String
from sqlalchemy.orm import relationship
from app import db
from app import main_table_list
from . import user as User
from datetime import datetime
from dataclasses import dataclass

@dataclass
class Forum(db.Model):
    __tablename__ = "forums"

    id: int
    title: str
    desc: str

    id = Column(Integer, primary_key=True)
    title = Column(String)
    desc = Column(String)

    def __repr__(self):
        return "<Forum(id={}, title={}>".format(self.id, self.title)

main_table_list[Forum.__tablename__] = Forum
