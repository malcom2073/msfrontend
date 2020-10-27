from app import app
from app import db

from app.models import user as User
from app.models import group as Group
from app.models import userprofilefield as UserProfileField
import csv
import pprint
import datetime
try:
    db.Model.metadata.create_all(db.engine)
    db.session.commit()
except:
    print("Failed to create")
    db.session.rollback()
    pass
try:
    db.session.add(Group.Group(id=1,name="Members",parent=4))
    db.session.add(Group.Group(id=2,name="Admin",parent=3))
    db.session.add(Group.Group(id=3,name="Moderator",parent=12))
    db.session.add(Group.Group(id=4,name="Unconfirmed Member"))
    db.session.add(Group.Group(id=5,name="Member-I",parent=1))
    db.session.add(Group.Group(id=6,name="Member-II",parent=5))
    db.session.add(Group.Group(id=7,name="Member-III",parent=6))
    db.session.add(Group.Group(id=8,name="Member-IV",parent=7))
    db.session.add(Group.Group(id=9,name="Member-V",parent=8))
    db.session.add(Group.Group(id=10,name="Member-VI",parent=9))
    db.session.add(Group.Group(id=11,name="Member-VII",parent=10))
    db.session.add(Group.Group(id=12,name="Donator",parent=11))  
    db.session.commit()
except Exception as e:
    pprint.pprint(e)
    print("Failed to load groups")
    db.session.rollback()
    
try:
    print("Trying to load test user")
    with open('output.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
            else:
                db.session.add(User.User(id=row[0],name=row[1],password=row[3],email=row[9],timezone='edt',lastip=row[11],nickname=row[2],primary_group_id=row[7],registered_date=datetime.datetime.utcfromtimestamp(int(row[6]))))
                line_count += 1
        print(f'Processed {line_count} lines.')
    db.session.commit()
except Exception as e:
    pprint.pprint(e)
    print("Failed to load test user")
    db.session.rollback()
    pass
print("Done loading")


app.run(host='0.0.0.0', port=5000, debug=True)