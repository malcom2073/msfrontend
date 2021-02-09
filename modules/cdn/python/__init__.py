from flask import Blueprint, render_template, Flask, jsonify, request,send_file
import pprint
import hashlib
import random
import string
import datetime
import jwt
import sys # For sys.stdout.flush()
from PIL import Image
from util import getJwt, getAuthToken
from auth import jwt_private
module_bp = Blueprint('cdn_bp', __name__)
module_prefix = '/cdn'
import db
import models
from app.models.user import User
from app.models.group import Group
from app.models import userprofilefield as UserProfileField
from modules.blog.python.models.msblogpost import MSBlogPost
import app
import os

from sqlalchemy import and_, or_, not_


@module_bp.route('/uploads/<filepath>',methods=['GET'])
def cdn(filepath):
    print('/cdn/uploads called for: ' + str(filepath))
    return send_file('/upload/' + filepath)


@module_bp.route('/upload',methods=['PUT'])
@jwt_private
def upload():
    print("/upload called")
    sys.stdout.flush()
    pprint.pprint(request.files)
    pprint.pprint(request)
    for f in request.files:
        print("File: " + f)
        pprint.pprint(request.files.get(f))
        filestor = request.files.get(f)
        filestor.save(os.path.join('/upload',f))
        size = 128, 128
        im = Image.open(os.path.join('/upload',f))
        im.thumbnail(size)
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB") 
        im.save(os.path.join('/upload',"thumbnail." + f), "JPEG")
    formdict = request.form.to_dict()
    pprint.pprint(formdict)
    #pprint.pprint(formdict['file'])
    #pprint.pprint(formdict['image[image]'])
    sys.stdout.flush()
    jwt = getJwt(request)
    post_data = request.get_json()
    pprint.pprint(post_data)
    return jsonify({'status':'success','path':'/cdn/uploads/' + "thumbnail." + f})

