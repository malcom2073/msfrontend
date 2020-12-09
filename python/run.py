from app import app
from app import db

from app.models.user import User
from app.models import group as Group
from app.models.msforumsforum import MSForumsForum
from app.models.msforumsthread import MSForumsThread
from app.models.msforumscomment import MSForumsComment
from app.models.userprofilefield import UserProfileField
import csv
import pprint
import datetime

def clearDatabase():
    for tbl in reversed(db.Model.metadata.sorted_tables):
        try:
            tbl.drop(db.engine)
        except:
            pass
def loadDatabase(usercsv, fakedata=False):
    try:
        db.Model.metadata.create_all(db.engine)
        db.session.commit()
        db.session.add(Group.Group(id=0,name="Admin"))
        db.session.commit()
        user = User(id=0,name="admin",primary_group_id=0)
        user.set_password("testpassword")
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        print("Failed to create")
        print(str(e))
        db.session.rollback()
        pass
    if fakedata:
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
            with open(usercsv) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                line_count = 0
                for row in csv_reader:
                    if line_count == 0:
                        line_count += 1
                    else:
                        db.session.add(User(id=row[0],name=row[1],password=row[3],email=row[9],timezone='edt',lastip=row[11],nickname=row[2],primary_group_id=row[7],registered_date=datetime.datetime.utcfromtimestamp(int(row[6]))))
                        line_count += 1
                print(f'Processed {line_count} lines.')
            db.session.commit()
        except Exception as e:
            pprint.pprint(e)
            print("Failed to load test user")
            db.session.rollback()
            pass

        try:
            db.session.add(MSForumsForum(id=0,parent=-1,title="Main Forum",desc=""))
            db.session.add(MSForumsForum(id=1,parent=0,title="General Discussion",desc="General discussion forum, for general topics"))
            db.session.add(MSForumsThread(id=0,forum_id=1,user_id=1,timestamp=(datetime.datetime.now()-datetime.timedelta(days=5)).timestamp(),subject="This is the title text of the first post",content="This is the text of the post!"))
            db.session.add(MSForumsComment(id=0,thread_id=0,user_id=16,timestamp=(datetime.datetime.now()-datetime.timedelta(days=4)).timestamp(),text="This is the text of the first comment on the first post"))
            db.session.add(MSForumsComment(id=1,thread_id=0,user_id=3,timestamp=(datetime.datetime.now()-datetime.timedelta(days=3)).timestamp(),text="This is a second comment on the first post"))
            db.session.add(MSForumsComment(id=2,thread_id=0,user_id=4,timestamp=(datetime.datetime.now()-datetime.timedelta(days=2)).timestamp(),text="This is a third comment on the first post"))
            db.session.add(MSForumsThread(id=1,forum_id=1,user_id=3,timestamp=(datetime.datetime.now()-datetime.timedelta(days=5)).timestamp(),subject="This is the title text of the second post",content="This is the text of the post!"))
            db.session.add(MSForumsComment(id=3,thread_id=1,user_id=1,timestamp=(datetime.datetime.now()-datetime.timedelta(days=4)).timestamp(),text="This is the text of the first  comment on the second post"))
            db.session.add(MSForumsComment(id=4,thread_id=1,user_id=7,timestamp=(datetime.datetime.now()-datetime.timedelta(days=3)).timestamp(),text="This is a second comment on the second post"))
            db.session.add(MSForumsComment(id=5,thread_id=1,user_id=9,timestamp=(datetime.datetime.now()-datetime.timedelta(days=2)).timestamp(),text="This is a third comment on the second post"))


            db.session.add(MSForumsForum(id=2,parent=0,title="Support",desc="General support requests forum, for support for specific stuff"))
            db.session.add(MSForumsThread(id=2,forum_id=2,user_id=1,timestamp=(datetime.datetime.now()-datetime.timedelta(days=3)).timestamp(),subject="This is the title text of the First post on this forum!",content="This is the text of the post!"))
            db.session.add(MSForumsThread(id=3,forum_id=2,user_id=1,timestamp=(datetime.datetime.now()-datetime.timedelta(days=2)).timestamp(),subject="This is the title text of the second psot on this forum!",content="This is the text of the post!"))
            db.session.add(MSForumsThread(id=4,forum_id=2,user_id=1,timestamp=(datetime.datetime.now()-datetime.timedelta(days=1)).timestamp(),subject="This is the title text of the third post on this forum!",content="This is the text of the post!"))

            db.session.add(MSForumsForum(id=3,parent=0,title="Suggestions",desc="Suggestion forum. Post your suggestions here!"))
            db.session.commit()
        except Exception as e:
            print(str(e))
            db.session.rollback()
            pass


        print("Done loading")

if __name__ == '__main__':
    loadDatabase('output.csv',True)
    app.run(host='0.0.0.0', port=5000, debug=True)