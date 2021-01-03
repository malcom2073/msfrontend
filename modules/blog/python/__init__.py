from flask import Blueprint, render_template, Flask, jsonify, request
import pprint
import hashlib
import random
import string
import datetime
import jwt
import sys # For sys.stdout.flush()

from util import getJwt, getAuthToken
from auth import jwt_private
module_bp = Blueprint('blog_bp', __name__)
module_prefix = '/blog'
import db
import models
from app.models.user import User
from app.models.group import Group
from app.models import userprofilefield as UserProfileField

import app


# Should there be a standard set of module endpoints?
# Something like: /getVersion, /getInfo, /getAuthor?

@module_bp.route('/addPost',methods=['POST'])
@jwt_private
def addPost():
    jwt = getJwt(request)
    post_data = request.get_json()
    pprint.pprint(post_data)
    print('Index: ' + str(post_data.get('index')))
    print('Parent: ' + str(post_data.get('parent')))
    print('Title: ' + post_data.get('subject'))
    print('text: ' + post_data.get('content'))
    sys.stdout.flush()
    try:
        dbsession = db.Session()
        #dbsession.add(MSForumsThread(id=post_data.get('index'),forum_id=post_data.get('parent'),subject=post_data.get('subject'),content=post_data.get('content')))
        dbsession.commit()
        dbsession.close()
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})


