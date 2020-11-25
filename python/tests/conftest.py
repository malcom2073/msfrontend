import pytest
from run import loadDatabase
from app import app
#from app import db
#import requests
#import json
#import os
#PASSWORD = "TestPassword"
#PASSWORD = os.getenv("MSPW")
import os

PASSWORD = "TestPassword"
PASSWORD = os.getenv("MSPW")

@pytest.fixture
def client():
    #db.Model.metadata.create_all(db.engine)
    #db.session.commit()
    print("Configuring client")
    loadDatabase('output.csv')
    return app.test_client()

