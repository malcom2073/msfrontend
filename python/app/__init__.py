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
from app.models.forum import Forum
from app.models.forumpost import ForumPost
from app.models import userprofilefield as UserProfileField

from .auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')
from .auth import jwt_private


@app.route('/getForumTopics',methods=['GET'])
def getForumTopics():
    forumid = int(request.args.get('forumid'))
    print('Forum ID Requested: ' + str(forumid))
    jwt = getJwt(request)
    dbsession = db.Session()
    #user = dbsession.query(User).filter(User.name == jwt['user']).first()
    forums = dbsession.query(ForumPost).filter(ForumPost.forum == forumid).all()
    dbsession.close()
    if forums is None:
        print("No users")
        return jsonify({'status':'failure','error':'No User'})
    return jsonify({'status':'success','data': forums})
    #elif forumid == 2:
    #    return jsonify([
    #    {
    #        return ["Tut - Topic 1","Tut - Topic 2", "Tut - Topic 3"];
    #    }


@app.route('/getForumList',methods=['GET'])
def getForumList():
    jwt = getJwt(request)
    dbsession = db.Session()
    #user = dbsession.query(User).filter(User.name == jwt['user']).first()
    forums = dbsession.query(Forum).filter(Forum.parent == 0).all()
    dbsession.close()
    if forums is None:
        print("No users")
        return jsonify({'status':'failure','error':'No User'})
    return jsonify({'status':'success','data': forums})

@app.route('/getPostList',methods=['GET'])
def getPostList():
    topicid = int(request.args.get('topicid'))
    print('topicid ID Requested: ' + str(topicid))
    if topicid == 0:
        return jsonify([
{
                    "id":1,
                    "user":"Malcom",
                    "date":1605147640,
                    "text": "This is the text of the first post on this topic!"
                },
                {
                    "id":2,
                    "user":"Mike",
                    "date":1605147740,
                    "text": "First response! Yay!"
                }
                ,
                {
                    "id":3,
                    "user":"Mike",
                    "date":1605147940,
                    "text": "I had some more to say. I had some more to say. I had some more to say. I had some more to say. I had some more to say. Lorum Ipsum or some stuff like that?"
                }
                ,
                {
                    "id":4,
                    "user":"Malcom",
                    "date":1605148140,
                    "text": "What're you babbling about?"
                }
                ,
                {
                    "id":5,
                    "user":"Mike",
                    "date":1605148240,
                    "text": "Nothing"
                }
        ])

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
        return jsonify({'status':'failure','error':'No User'})
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
        return jsonify({'status':'failure','error':'No User'})
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


