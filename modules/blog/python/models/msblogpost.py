#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
#from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app import db
from app import main_table_list
from app.models.user import User
from datetime import datetime
from dataclasses import dataclass
from typing import Type


@dataclass
class MSBlogPost(db.Model):
    __tablename__ = "msblog_posts"

    id: int
    title: str
    user: User
    timestamp: int
    content: str
    published: bool

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User",backref="msblog_posts")
    title = Column(String)
    content = Column(String)
    timestamp = Column(Integer)
    published = Column(Boolean)

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[MSBlogPost.__tablename__] = MSBlogPost
