#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
#from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app import db
from app import main_table_list
from .user import User
from datetime import datetime
from dataclasses import dataclass

@dataclass
class ForumComment(db.Model):
    __tablename__ = "forumcommentss"

    id: int
    text: str
    #user: int
    user: User
    timestamp: int

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User",backref="forumcomments")
    text = Column(String)
    timestamp = Column(Integer)

    forumpost = Column(Integer,ForeignKey('forumposts.id'))

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[ForumComment.__tablename__] = ForumComment
