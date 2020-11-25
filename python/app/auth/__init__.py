from flask import Blueprint, render_template, Flask, jsonify, request
import pprint
import hashlib
import random
import string
import datetime
import jwt

from ..util import getJwt, getAuthToken
auth_bp = Blueprint('auth_bp', __name__)
from .. import db
from .. import User
from .. import Group
from .. import UserProfileField
from .. import app

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
        print("Done",flush=True)
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
    

# Be sure to return 4, I rolled 3d8 to get that.
def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    print("Random string of length", length, "is:", result_str)
    return result_str

# This method is used for refreshing a token. It will also change and refresh the sessionid cookie
@auth_bp.route('/refresh',methods=['POST'])
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
@auth_bp.route('/auth', methods=['POST'])
def auth():
    post_data = request.get_json()
    print('User: ' + post_data.get('username'))
    print('Pass: ' + post_data.get('password'))
    dbsession = db.Session()
    user = dbsession.query(User).filter(User.name == post_data.get('username')).first()
    pprint.pprint(user)
    dbsession.close()
    if user is None:
        print("No user")
        return jsonify({'status':'error','error':'invalid credentials'}),401
    if user is None or not user.check_password(post_data.get('password')):
        print("Invalid user/pass")
        return jsonify({'status':'error','error':'invalid credentials'}),401
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
@auth_bp.route('/logout',methods=['POST'])
@jwt_private
def logout():
    print('LOGGING OUT*****************')
    resp = jsonify({'status':'success'})
    resp.set_cookie('mspysid', '', expires=0)
    return resp

