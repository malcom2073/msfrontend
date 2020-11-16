import json
from flask import Flask, jsonify, request
import datetime
import jwt
import pprint
import hashlib
import random
import csv
import string
from . import config
from . import db
app = Flask(__name__)

from .util import getJwt
from .auth import jwt_private
# Obv this will need to be changed for production.
app.config['SECRET_KEY'] = config.SECRET_KEY

main_table_list = {}

def encode_auth_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=600),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

from app.models import user as User
from app.models import group as Group
from app.models import userprofilefield as UserProfileField


@app.route('/getForumTopics',methods=['GET'])
def getForumTopics():
    forumid = int(request.args.get('forumid'))
    print('Forum ID Requested: ' + str(forumid))
    if forumid == 0:
        return jsonify([
                {
                    "id":0,
                    "title":"GD - Topic1",
                    "summary":"This is a summary of the first topic. It will contain the text form the topic..."
                },
                {
                    "id":1,
                    "title":"GD - Topic2",
                    "summary":"This summary is for the second topic, it will be about the same length as the..."
                }
        ])
    elif forumid == 1:
        return jsonify([
                {
                    "id":2,
                    "title":"Support - Topic 1",
                    "summary":"Suport topic number 1, is the first support topic in the forums, and as such ..."
                },
                {
                    "id":3,
                    "title":"Support - Topic 2",
                "summary":"Summary for support topic number 2! Second of the stupport topics, but just as help..."
                }
        ])
    else:
        print("Bad forum id:")
        print(forumid)
        return jsonify({})
    #elif forumid == 2:
    #    return jsonify([
    #    {
    #        return ["Tut - Topic 1","Tut - Topic 2", "Tut - Topic 3"];
    #    }

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

def checkRole(role,roletocheck):
    if role == roletocheck:
        return True
    if role in roles:
        if 'parent' in roles[role]:
            return checkRole(roles[role]['parent'],roletocheck)
    return False
roles = {
    'admin' : {
        'parent':'member3'
    },
    'member3' : {
        'parent':'member2'
    },
    'member' : {
        'parent':'guest'
    },
    'member2' : {
        'parent':'member'
    },
    'guest' : {

    }
}
role_routes = {
    '/auth' : {
        'role_required': None
    },
    '/private' : {
        'role_required':'member'
    }
}

@app.route('/userinfo')
@jwt_private
def userinfo():
    jwt = getJwt(request)
    dbsession = db.Session()
    user = dbsession.query(User.User).filter(User.User.name == jwt['user']).first()
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
    users = dbsession.query(User.User).all()
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


