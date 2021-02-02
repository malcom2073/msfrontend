import json
from flask import Flask, jsonify, request
import pprint
import csv
import config
import db
app = Flask(__name__)
from util import getJwt
# Obv this will need to be changed for production.
app.config['SECRET_KEY'] = config.SECRET_KEY
main_table_list = {}

from app.models.user import User
from app.models.group import Group
from app.models import userprofilefield as UserProfileField

from .auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')
from .auth import jwt_private


def loadModules():
    print("loading")
    import os
    import importlib
    d = '../modules/'
    for o in os.listdir(d):
        if os.path.isdir(os.path.join(d,o)):
            if os.path.isdir(os.path.join(d,o,'python')):
                #Module has a python folder! Import it!
                i = importlib.import_module(".",'modules.' + o + '.python')
                app.register_blueprint(i.module_bp,url_prefix=i.module_prefix)
                print("Imported module")
                print(i)
            print("Dir: " + os.path.join(d,o))

loadModules()

@app.route('/getUser',methods=['GET'])
def getUser():
    userid = int(request.args.get('userid'))
    print('userid Requested: ' + str(userid))
    dbsession = db.Session()
    userobj = dbsession.query(User).filter(User.id == userid).first()
    if userobj is None:
        dbsession.close()
        return jsonify({'status':'error','error':'Invalid user'})
    jsonresponse = jsonify({'status':'success','data':userobj}) # Grab response before closing database, this fixes lazy-loading errors.
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
            'title':  'Blog',
            'link': '/blog',
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


