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
from modules.blog.python.models.msblogpost import MSBlogPost
import app


# Should there be a standard set of module endpoints?
# Something like: /getVersion, /getInfo, /getAuthor?

@module_bp.route('/addPost',methods=['POST'])
@jwt_private
def addPost():
    jwt = getJwt(request)
    post_data = request.get_json()
    pprint.pprint(post_data)
    #print('Index: ' + str(post_data.get('id')))
    print('Title: ' + post_data.get('title'))
    print('Date: ' + str(post_data.get('date')))
    print('Content: ' + post_data.get('content'))
    sys.stdout.flush()
    try:
        dbsession = db.Session()
        dbsession.add(MSBlogPost(title=post_data.get('title'),timestamp=post_data.get('date'),content=post_data.get('content')))
        dbsession.commit()
        dbsession.close()
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})


@module_bp.route('/editPost',methods=['POST'])
@jwt_private
def editPost():
    jwt = getJwt(request)
    post_data = request.get_json()
    #pprint.pprint(post_data)
    #print('Index: ' + str(post_data.get('id')))
    print('Title: ' + post_data.get('title'))
    print('ID: ' + str(post_data.get('id')))
    postid = post_data.get('id')
    print('Content: '.encode('utf-8') + post_data.get('content').encode('utf-8'))
    sys.stdout.flush()
    dbsession = db.Session()
    try:
        postlist = dbsession.query(MSBlogPost).filter(MSBlogPost.id == postid).all()
        singlepost = postlist[0]
        singlepost.title = post_data.get('title')
        singlepost.content = post_data.get('content')
        dbsession.commit()
        dbsession.close()
    except Exception as e:
        dbsession.rollback()
        dbsession.close()
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})


@module_bp.route('/getPosts',methods=['GET'])
def getPosts():
#    jwt = getJwt(request)
#    post_data = request.get_json()
#    pprint.pprint(post_data)
    #print('Index: ' + str(post_data.get('id')))
#    print('Last: ' + str(post_data.get('last')))
#    sys.stdout.flush()
    try:
        dbsession = db.Session()
        postlist = dbsession.query(MSBlogPost).all()
        jsonresponse = jsonify({'status':'success','data': postlist})
        dbsession.close()
        if postlist is None or len(postlist) == 0:
            print("No posts")
            return jsonify({'status':'error','error':'No Posts'})
        return jsonresponse
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})



@module_bp.route('/getPost',methods=['GET'])
def getPost():
#    jwt = getJwt(request)
    postid = int(request.args.get('postid'))
#    pprint.pprint(post_data)
    #print('Index: ' + str(post_data.get('id')))
#    sys.stdout.flush()
    try:
        dbsession = db.Session()
        postlist = dbsession.query(MSBlogPost).filter(MSBlogPost.id == postid).all()
        jsonresponse = jsonify({'status':'success','data': postlist[0]})
        dbsession.close()
        if postlist is None or len(postlist) == 0:
            print("No posts")
            return jsonify({'status':'error','error':'No Posts'})
        return jsonresponse
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})
    return jsonify({'status':'success'})



