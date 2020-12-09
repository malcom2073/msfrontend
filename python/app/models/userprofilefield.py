#from sqlalchemy import Column, ForeignKey, Integer, String
#from sqlalchemy.orm import relationship

#from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app import db
#Base = declarative_base()
from app.models.user import User

class UserProfileField(db.Model):
    __tablename__ = "user_profile_fields"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id))
    user = relationship("User", back_populates="profilefields")

    key = Column(String)
    value = Column(String)

    def __repr__(self):
        return "<UserProfileField(user_id={}, key={}, value={})>".format(
            self.user_id, self.key, self.value
        )