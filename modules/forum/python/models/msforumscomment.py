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
from typing import Type


@dataclass
class MSForumsComment(db.Model):
    __tablename__ = "msforums_comments"

    id: int
    text: str
    user: User
    timestamp: int
    thread: Type['MSForumsThread'] # Parent forum, only top level should be null

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User",backref="msforums_comments")
    text = Column(String)
    timestamp = Column(Integer)

    thread_id = Column(Integer,ForeignKey('msforums_threads.id'))
    thread = relationship("MSForumsThread",backref="msforums_comments")

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[MSForumsComment.__tablename__] = MSForumsComment
