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
from typing import Type

@dataclass
class MSForumsForum(db.Model):
    __tablename__ = "msforums_forums"

    id: int # Auto incremented ID
    #parent: Type['MSForumsForum'] # Parent forum, only top level should be null
    title: str # Title of the forum
    desc: str # Description for the forum
    timestamp: int # UnixTime when created
    user: User # User that created it

    id = Column(Integer, primary_key=True)
    parent = Column(Integer,ForeignKey('msforums_forums.id'))
    #parent = relationship("MSForumsForum",backref="children")
    title = Column(String)
    desc = Column(String)
    timestamp = Column(Integer)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User",backref="msforums_forums")

    def __repr__(self):
        return "<Forum(id={}, title={}>".format(self.id, self.title)

main_table_list[MSForumsForum.__tablename__] = MSForumsForum
