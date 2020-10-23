#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
#from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Column, Integer, String
from sqlalchemy.orm import relationship
from app import db
from app import main_table_list
from datetime import datetime
from dataclasses import dataclass

@dataclass
class Group(db.Model):
    __tablename__ = "groups"

    id: int
    name: str
#    parent: Group # Can't do this!

    id = Column(Integer, primary_key=True)

    parent = Column(Integer, ForeignKey("groups.id"),nullable=True)
    #children = relationship("Group", back_populates="parent")
    name = Column(String)
    users = relationship("User", back_populates="primary_group")

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[Group.__tablename__] = Group
