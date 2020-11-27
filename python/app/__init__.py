import json
from flask import Flask, jsonify, request
import pprint
import csv
from . import config
from . import db
app = Flask(__name__)
from .util import getJwt
# Obv this will need to be changed for production.
app.config['SECRET_KEY'] = config.SECRET_KEY

main_table_list = {}


from app.models.user import User
from app.models import group as Group
from app.models.msforumsforum import MSForumsForum
from app.models.msforumsthread import MSForumsThread
from app.models.msforumscomment import MSForumsComment
from app.models import userprofilefield as UserProfileField

from .auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')
from .auth import jwt_private



# API:
# POST addThread - Add a new thread
# POST delThread - Delete a thread
# GET getThreads - Get a list of threads in a forum
# POST addForum - Add a new forum
# POST delForum - Delete a forum (Not yet implemented)
# GET getForums - Get a list of forums in a forum.
# POST addComment - Add a comment to a thread (Not yet implemented)
# POST delComment - Delete a comment on a thread (Not yet implemented)
# GET getComments - Get a list of comments in a thread (Not yet implemented)

@app.route('/addThread',methods=['POST'])
@jwt_private
def addThread():
    jwt = getJwt(request)
    post_data = request.get_json()
    print('Index: ' + str(post_data.get('index')))
    print('Parent: ' + str(post_data.get('parent')))
    print('Title: ' + post_data.get('title'))
    print('text: ' + post_data.get('text'))
    try:
        dbsession = db.Session()
        dbsession.add(MSForumsThread(id=post_data.get('index'),forum_id=post_data.get('parent'),title=post_data.get('title'),text=post_data.get('text')))
        dbsession.commit()
        dbsession.close()
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})


@app.route('/delThread',methods=['POST'])
@jwt_private
def delThread():
    jwt = getJwt(request)
    post_data = request.get_json()
    print('Index: ' + str(post_data.get('index')))
    try:
        dbsession = db.Session()
        forumthread = dbsession.query(MSforumsThread).filter(MSForumsThread.id == post_data.get('index')).get()
        result = dbsession.query(MSForumsComment).filter(MSForumsComment.thread_id == forumthread.id).all()
        for comment in result:
            dbsession.delete(comment)
        dbsession.delete(forumthread)
        dbsession.commit()
        dbsession.close()
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})

@app.route('/getThreads',methods=['GET'])
def getForumTopics():
    forumid = int(request.args.get('forumid'))
    print('Forum ID Requested: ' + str(forumid))
    jwt = getJwt(request)
    dbsession = db.Session()
    #user = dbsession.query(User).filter(User.name == jwt['user']).first()
    forums = dbsession.query(MSForumsThread).filter(MSForumsThread.forum_id == forumid).all()
    jsonresponse = jsonify({'status':'success','data': forums})
    dbsession.close()
    if forums is None:
        print("No users")
        return jsonify({'status':'error','error':'No User'})
    return jsonresponse
    #elif forumid == 2:
    #    return jsonify([
    #    {
    #        return ["Tut - Topic 1","Tut - Topic 2", "Tut - Topic 3"];
    #    }

@app.route('/addForum',methods=['POST'])
@jwt_private
def addForum():
    jwt = getJwt(request)
    post_data = request.get_json()
    print('Index: ' + str(post_data.get('index')))
    print('Parent: ' + str(post_data.get('parent')))
    print('Title: ' + post_data.get('title'))
    print('Desc: ' + post_data.get('desc'))
    try:
        dbsession = db.Session()
        dbsession.add(MSForumsForum(id=post_data.get('index'),parent=0,title=post_data.get('title'),desc=post_data.get('desc')))
        dbsession.commit()
        dbsession.close()
    except:
        return jsonify({'status':'error','error':'Unknown error'})
    return jsonify({'status':'success'})

@app.route('/getForums',methods=['GET'])
def getForumList():
    jwt = getJwt(request)
    dbsession = db.Session()
    #user = dbsession.query(User).filter(User.name == jwt['user']).first()
    forums = dbsession.query(MSForumsForum).filter(MSForumsForum.parent == 0).all()
    if forums is None or len(forums) == 0:
        dbsession.close()
        print("No forums")
        return jsonify({'status':'error','error':'No forums listed'})
    jsonresponse = jsonify({'status':'success','data': forums})
    dbsession.close()
    return jsonresponse

@app.route('/delForum',methods=['POST'])
def delForum():
    jwt = getJwt(request)
    dbsession = db.Session()
    #user = dbsession.query(User).filter(User.name == jwt['user']).first()
    forums = dbsession.query(MSForumsForum).filter(MSForumsForum.parent == 0).all()
    if forums is None or len(forums) == 0:
        dbsession.close()
        print("No forums")
        return jsonify({'status':'error','error':'No forums listed'})
    jsonresponse = jsonify({'status':'success','data': forums})
    dbsession.close()
    return jsonresponse



@app.route('/getComments',methods=['GET'])
def getPostList():
    topicid = int(request.args.get('topicid'))
    print('topicid ID Requested: ' + str(topicid))
    dbsession = db.Session()
    topic = dbsession.query(MSForumsThread).filter(MSForumsThread.id == topicid).all()
    if topic is None:
        dbsession.close()
        return jsonify({'status':'error','error':'Invalid topic'})
    posts = dbsession.query(MSForumsComment).filter(MSForumsComment.thread_id == topicid).all()
    jsonresponse = jsonify({'status':'success','data':topic + posts}) # Grab response before closing database, this fixes lazy-loading errors.
    dbsession.close()
    return jsonresponse

@app.route('/userinfo')
@jwt_private
def userinfo():
    jwt = getJwt(request)
    dbsession = db.Session()
    user = dbsession.query(User).filter(User.name == jwt['user']).first()
    pprint.pprint(user)
    dbsession.close()
    if user is None:
        print("No user")
        return jsonify({'status':'error','error':'No User'})
    return jsonify({'status':'success','data': user})


@app.route('/userlist')
@jwt_private
def userlist():
    jwt = getJwt(request)
    dbsession = db.Session()
    users = dbsession.query(User).all()
    pprint.pprint(users)
    dbsession.close()
    if users is None:
        print("No users")
        return jsonify({'status':'error','error':'No User'})
    return jsonify({'status':'success','data': users})


@app.route('/private')
@jwt_private
def private():
    #post_data = request.get_json()
    #pprint.pprint(resp)
    return 'Private data!\n'

@app.route('/')
def index():
    return jsonify({'name': 'alice',
                    'email': 'alice@outlook.com'})


@app.route('/getAllPostIds')
def getAllPostIds():
    return jsonify([
        {
            'params': {
                'ids': 'ssg-ssr'
            }
        },
#        {
#            'params' : {
#                'ids': 'pre-rendering'
#            }
#        }
    ])

    
@app.route('/getNavbar')
def getNavbar():
    print("test2")
    menuleftlist = [
        {
            'title':  'Home',
            'link': '/',
            'type':'link'
        },
        {
            'title':  'Forum',
            'link': '/forums',
            'type':'link'
        },
        {
            'title':  'Status',
            'link': '/status',
            'type':'link'
        },
        {
            'title':  'Private',
            'link': '/private',
            'type':'link'
        },
        {
            'title':  'Profile',
            'link': '/profile',
            'type':'link'
        },
        {
            'title':  'Users',
            'link': '/users',
            'type':'link'
        },
    ]
    print("test")
    jwt = getJwt(request)
    print('jwt')
    pprint.pprint(jwt)
    print('Donejwt')
    if jwt is not None:
        menurightlist = [
        {
                'title':  jwt['user'],
                'type':'dropdown',
                'links': [
                    {
                        'title': 'Profile',
                        'type':'link',
                        'link' : '/profile'
                    },
                    {
                        'title': 'Logout',
                        'type':'link',
                        'link' : '/logout'
                    },
                    {
                        'title': '',
                        'type':'divider'
                    },
                    {
                        'title': 'Sign-Up',
                        'type':'link',
                        'link' : '/signup'
                    }
                ]
            },
        ]
    else:
        menurightlist = [
        {
                'title':  'Guest',
                'type':'dropdown',
                'links': [
                    {
                        'title': 'Login',
                        'type':'link',
                        'link' : '/login'
                    },
                    {
                        'title': '',
                        'type':'divider'
                    },
                    {
                        'title': 'Sign-Up',
                        'type':'link',
                        'link' : '/signup'
                    }
                ]
            },
        ]
    return jsonify({'menuleft' : menuleftlist,'menuright' : menurightlist})


