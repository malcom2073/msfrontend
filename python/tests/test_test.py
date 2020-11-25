import os
import tempfile
import pprint
import pytest
from run import loadDatabase
from app import config
config.SQLALCHEMY_DATABASE_URI = "pytests.sqlite"
from app import app
from app import db
import json
PASSWORD = "TestPassword"
@pytest.fixture
def client():
    #db.Model.metadata.create_all(db.engine)
    #db.session.commit()
    loadDatabase()
    return app.test_client()



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
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')
    rv = client.post('/auth/auth',json={ 'username': 'Malcom', 'password': PASSWORD })
    print("Auth:")
    print(rv.data)
    jsonresponse = json.loads(rv.data)
    assert jsonresponse['status'] == 'success'

def test_withbadauth(client):
    rv = client.get('/private')
    jsonresponse = json.loads(rv.data)
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')
    rv = client.post('/auth/auth',json={ 'username': 'Malcom', 'password': 'BadPassword' })
    print("Auth:")
    print(rv.data)
    jsonresponse = json.loads(rv.data)
    assert jsonresponse['status'] == 'error'
