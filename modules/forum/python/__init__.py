from flask import Blueprint, render_template, Flask, jsonify, request
import pprint
import hashlib
import random
import string
import datetime
import jwt

from util import getJwt, getAuthToken
from auth import jwt_private
module_bp = Blueprint('forum_bp', __name__)
module_prefix = '/forum'
import db
import models
from app.models.user import User
from app.models.group import Group
from modules.forum.python.models.msforumsforum import MSForumsForum
from modules.forum.python.models.msforumsthread import MSForumsThread
from modules.forum.python.models.msforumscomment import MSForumsComment
from app.models import userprofilefield as UserProfileField

import app



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

@module_bp.route('/addThread',methods=['POST'])
@jwt_private
def addThread():
    jwt = getJwt(request)
    post_data = request.get_json()
    print('Index: ' + str(post_data.get('index')))
    print('Parent: ' + str(post_data.get('parent')))
    print('Title: ' + post_data.get('subject'))
    print('text: ' + post_data.get('content'))
    try:
        dbsession = db.Session()
        dbsession.add(MSForumsThread(id=post_data.get('index'),forum_id=post_data.get('parent'),subject=post_data.get('subject'),content=post_data.get('content')))
        dbsession.commit()
        dbsession.close()
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})


@module_bp.route('/delThread',methods=['POST'])
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

@module_bp.route('/getThreads',methods=['GET'])
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

@module_bp.route('/addForum',methods=['POST'])
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


@module_bp.route('/getForums',methods=['GET'])
def getForumList():
    jwt = getJwt(request)
    dbsession = db.Session()
    forums = dbsession.query(MSForumsForum).filter(MSForumsForum.parent == 0).all()
    if forums is None or len(forums) == 0:
        dbsession.close()
        print("No forums")
        return jsonify({'status':'error','error':'No forums listed'})
    jsonresponse = jsonify({'status':'success','data': forums})
    dbsession.close()
    return jsonresponse

@module_bp.route('/delForum',methods=['POST'])
def delForum():
    jwt = getJwt(request)
    dbsession = db.Session()
    forums = dbsession.query(MSForumsForum).filter(MSForumsForum.parent == 0).all()
    if forums is None or len(forums) == 0:
        dbsession.close()
        print("No forums")
        return jsonify({'status':'error','error':'No forums listed'})
    jsonresponse = jsonify({'status':'success','data': forums})
    dbsession.close()
    return jsonresponse


@module_bp.route('/getComments',methods=['GET'])
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