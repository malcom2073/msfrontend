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


def decode_auth_token(auth_token):
    payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
    return payload['sub']

# Pulls the auth token out of a request if it exists in the Authorization header
def getAuthToken(request):
    auth_header = request.headers.get('Authorization')
    auth_token = ''
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
            return auth_token
        except:
            pass
    return None

def getJwt(request):
    auth_token = getAuthToken(request)
    pprint.pprint(auth_token)
    if auth_token:
        try:
            resp = decode_auth_token(auth_token)
            pprint.pprint(resp)
            print("Cookies")
            pprint.pprint(request.cookies)
            if resp:
                if 'mspysid' in request.cookies:
                    session = request.cookies['mspysid']
                    m = hashlib.sha256()
                    if session is not None:
                        m.update(session.encode('utf-8'))
                        if m.hexdigest() != resp['session']:
                            print('Invalid hex')
                            return None
                    else:
                        print('No session var')
                        return None
                    return resp
        except:
            print('Exception')
            return None
    return None

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
# Wrapper function for needing jwt
# This checks the JWT expiration, as well as making sure that there is a 
# cookie (should check httponly and secure) matching the sha256 of the session ID
# Is this a good way to prevent XSS? Someone would have to hijack both the JWT, as well
# as the session cookie, which if the latter is stored in httponly, that should be impossible?
# We should invalidate tokens used with either no session, or an invalid session as an
# additional security measure.
 
def jwt_private(func):
    def wrapper_jwt_private(*args, **kwargs):
        print('Path:')
        pprint.pprint(request.path)
        auth_token = getAuthToken(request)
        jwt = getJwt(request)
        if jwt is None:
            return jsonify({'status':'error','error':'Null session'}),401
        pprint.pprint(jwt)
        if request.path in role_routes:
            if 'role_required' in role_routes[request.path]:
                minrole = role_routes[request.path]['role_required']
                foundrole = False
                for role in jwt['roles']:
                    if checkRole(role,minrole):
                        foundrole = True
                        break
                if foundrole:
                    return func(*args, **kwargs)
                else:
                    return jsonify({'status':'error','error':'Invalid permissions'}),401
        else:
            return func(*args,**kwargs)
    wrapper_jwt_private.__name__ = func.__name__
    return wrapper_jwt_private
    

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

# Be sure to return 4, I rolled 3d8 to get that.
def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    print("Random string of length", length, "is:", result_str)
    return result_str

# This method is used for refreshing a token. It will also change and refresh the sessionid cookie
@app.route('/refresh',methods=['POST'])
@jwt_private
def refresh():
    jwt_token = getJwt(request) # This is always valid due to @jwt_private decorator
    session = request.cookies.get('session')
    m = hashlib.sha256()
    if session is None:
        session = get_random_string(24)
    m.update(session.encode('utf-8'))

    # TODO: These are hardcoded at the moment.
    jwt_token['session'] = m.hexdigest()
    resp = jsonify({'status':'success','access_token':encode_auth_token(jwt_token).decode('utf-8')})
    resp.set_cookie("mspysid", value = session, httponly = True)
    return resp

# Post to here to authenticate, get your httponly cookie, and get your jwt matching it.
# TODO: Add roles to this? We now have database backend.
# Do we need a separate jwt for role storage? Should the auth cookie be purely for auth?
# Cookies have size limitations to them...
@app.route('/auth', methods=['POST'])
def auth():
    post_data = request.get_json()
    print('User: ' + post_data.get('username'))
    print('Pass: ' + post_data.get('password'))
    dbsession = db.Session()
    user = dbsession.query(User.User).filter(User.User.name == post_data.get('username')).first()
    pprint.pprint(user)
    dbsession.close()
    if user is None:
        print("No user")
        return jsonify({'status':'failure','error':'invalid credentials'}),401
    if user is None or not user.check_password(post_data.get('password')):
        print("Invalid user/pass")
        return jsonify({'status':'failure','error':'invalid credentials'}),401
    session = request.cookies.get('session')
    m = hashlib.sha256()
    if session is None:
        session = get_random_string(24)
    m.update(session.encode('utf-8'))

    # TODO: These are hardcoded at the moment.
    roleobj = {
        'user': post_data.get('username'),
        'roles': [
            'admin',
            'member-i',
            'member-iv'
        ],
        'session': m.hexdigest()
    }
    resp = jsonify({'status':'success','access_token':encode_auth_token(roleobj).decode('utf-8')})
    resp.set_cookie("mspysid", value = session, httponly = True)
    return resp

# Log out, this clears out the session cookie so future requests fail. 
# TODO: Also invalidate the jwt and keep it in the invalidation store until expiration.
@app.route('/logout',methods=['POST'])
@jwt_private
def logout():
    print('LOGGING OUT*****************')
    resp = jsonify({'status':'success'})
    resp.set_cookie('mspysid', '', expires=0)
    return resp

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


