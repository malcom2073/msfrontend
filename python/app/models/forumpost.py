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
class ForumPost(db.Model):
    __tablename__ = "forumposts"

    id: int
    text: str

    id = Column(Integer, primary_key=True)
    user = Column(Integer,ForeignKey('users.id'))
    text = Column(String)

    forum = Column(Integer,ForeignKey('forums.id'))

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[ForumPost.__tablename__] = ForumPost
