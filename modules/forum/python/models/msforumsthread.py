#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
#from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app import db
from app import main_table_list
from app.models.user import User
from datetime import datetime
from dataclasses import dataclass

@dataclass
class MSForumsThread(db.Model):
    __tablename__ = "msforums_threads"

    id: int # Auto incremented ID
    subject: str # Title of the thread post
    content: str # Text of the thread post
    user: User # User that created it
    timestamp: int # UnixTime when posted
    edited: int # UnixTime when edited, non zero if it has been edited.

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User",backref="msforums_threads")
    subject = Column(String)
    content = Column(String)
    timestamp = Column(Integer)
    edited = Column(Integer)

    forum_id = Column(Integer,ForeignKey('msforums_forums.id'))
    forum = relationship("MSForumsForum",backref="forums")

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[MSForumsThread.__tablename__] = MSForumsThread
