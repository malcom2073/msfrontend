import json
from flask import Flask, jsonify, request
import datetime
import jwt
import pprint
import hashlib
app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdfklasjdfl;sahfdasjlkhfkjalrelka;sjdfl;sakhfdla;skhdfjklsa;jfdas'

def encode_auth_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=300),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )


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

def jwt_private(func):
    def wrapper_jwt_private(*args, **kwargs):
        print('Path:')
        pprint.pprint(request.path)
        auth_token = getAuthToken(request)
        if auth_token:
            try:
                resp = decode_auth_token(auth_token)
                if resp:
                    pprint.pprint(resp)
                    pprint.pprint(request.cookies)
                    session = request.cookies.get('session')
                    m = hashlib.sha256()
                    if session is not None:
                        m.update(session.encode('utf-8'))
                        if m.hexdigest() != resp['session']:
                            return jsonify({'status':'error','error':'Invalid session'}),401
                    else:
                        return jsonify({'status':'error','error':'Null session'}),401
                    if request.path in role_routes and 'role_required' in role_routes[request.path]:
                        minrole = role_routes[request.path]['role_required']
                        foundrole = False
                        for role in resp['roles']:
                            if checkRole(role,minrole):
                                foundrole = True
                                break
                        if foundrole:
                            return func(*args, **kwargs)
                        else:
                            return jsonify({'status':'error','error':'Invalid permissions'}),401
            except jwt.ExpiredSignatureError:
                return jsonify({'status':'error','error':'Expired Signature'}),401
            except jwt.InvalidTokenError:
                return jsonify({'status':'error','error':'Invalid Token'}),401
        return jsonify({'status':'error','error':'Invalid Auth'}),401
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

@app.route('/auth', methods=['POST'])
def auth():
    post_data = request.get_json()
    print('User: ' + post_data.get('username'))
    print('Pass: ' + post_data.get('password'))
    session = request.cookies.get('session')
    m = hashlib.sha256()
    m.update(session.encode('utf-8'))
    
    roleobj = {
        'user': post_data.get('username'),
        'roles': [
            'admin',
            'member-i',
            'member-iv'
        ],
        'session': m.hexdigest()
    }
    return jsonify({'status':'success','access_token':encode_auth_token(roleobj).decode('utf-8')})

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
    menuleftlist = [
        {
            'title':  'Home',
            'link': '/',
            'type':'link'
        },
        {
            'title':  'Forum',
            'link': '/forum',
            'type':'link'
        },
        {
            'title':  'Status',
            'link': '/status',
            'type':'link'
        },
    ]
    auth_token = getAuthToken(request)
    print("auth")
    print(auth_token)
    if auth_token:
        menurightlist = [
        {
                'title':  'User',
                'type':'dropdown',
                'links': [
                    {
                        'title': 'Logout',
                        'type':'link',
                        'link' : '/Logout'
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

app.run()


