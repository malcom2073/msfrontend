import os
import tempfile
import pprint
import pytest
from run import loadDatabase
from app import config
config.SQLALCHEMY_DATABASE_URI = "pytests.sqlite"
from app import app
from app import db
import requests
import json

from conftest import client
from conftest import PASSWORD
from conftest import USER

def test_empty_db(client):
    """Start with a blank database."""
    rv = client.get('/private')
    pprint.pprint(rv.data)
#    assert b'No entries here so far' in rv.data

def test_noauth(client):
    rv = client.get('/private')
    jsonresponse = json.loads(rv.data)
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')

def test_withgoodauth(client):
    rv = client.get('/private')
    jsonresponse = json.loads(rv.data)
    # Verify we get a null session
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')
    rv = client.post('/auth/auth',json={ 'username': USER, 'password': PASSWORD })
    print("Auth:")
    print(rv.data)
    jsonresponse = json.loads(rv.data)
    # Verify the password worked.
    assert jsonresponse['status'] == 'success'

def test_withbadauth(client):
    rv = client.get('/private')
    jsonresponse = json.loads(rv.data)
    # Verify we get a null session
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')
    rv = client.post('/auth/auth',json={ 'username': USER, 'password': 'BadPassword' })
    print("Auth:")
    print(rv.data)
    jsonresponse = json.loads(rv.data)
    # Verify we get an error when we have an invalid password
    assert jsonresponse['status'] == 'error' and jsonresponse['error'] == 'invalid credentials'

def test_cookieRequest(client):
    rv = client.get('/userinfo')
    jsonresponse = json.loads(rv.data)
    # Verify we get a null session
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')
    rv = client.post('/auth/auth',json={ 'username': USER, 'password': PASSWORD })
    jsonresponse = json.loads(rv.data)
    # Verify the password worked.
    assert jsonresponse['status'] == 'success'
    assert 'access_token' in jsonresponse
    accesstoken = jsonresponse['access_token']
    print("Auth:")
    print(rv.data)
    print("Cookies")
    assert 'Set-Cookie' in rv.headers
    cookie = rv.headers['Set-Cookie']

    rv = client.get('/userinfo',headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken})
    pprint.pprint(rv.data)
    jsonresponse = json.loads(rv.data)
    assert 'data' in jsonresponse
    assert 'name' in jsonresponse['data'] and jsonresponse['data']['name'] == USER
    
    #assert False
