#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
#from flask_sqlalchemy import SQLAlchemy
from app import db
from app import main_table_list
from datetime import datetime
from . import group as Group
from dataclasses import dataclass
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
import bcrypt


@dataclass
class User(db.Model):
    __tablename__ = "users"
    id: int
    name: str
    nickname: str
    password: str
    email: str
    timezone: str
    lastip: str
    nickname: str
    primary_group: Group

    id = Column(Integer, primary_key=True)
    name = Column(String)
    nickname = Column(String)
    password = Column(String)
    email = Column(String)
    timezone = Column(String)
    lastip = Column(String)
    nickname = Column(String)

    primary_group_id = Column(Integer, ForeignKey(Group.Group.id))
    primary_group = relationship("Group",back_populates="users",lazy="joined")

    #secondary_groups = db.relationship("Group",secondary="user_secondary_group_assoc")


    profilefields = relationship("UserProfileField", back_populates="user")

    registered_date = Column(DateTime, nullable=False,default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        # This makes us comaptible with PHP's 'default' verify_password function.
        return bcrypt.checkpw(password.encode('utf-8'),self.password.encode('utf-8'))
        #return check_password_hash(self.password, password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return "<User(id={}, name={}>".format(self.id, self.name)

main_table_list[User.__tablename__] = User
