import pytest
from run import loadDatabase, clearDatabase
from app import app
import os
import sys
USER = "admin"
PASSWORD = "testpassword"

@pytest.fixture
def client():
    #db.Model.metadata.create_all(db.engine)
    #db.session.commit()
    sys.path.append("C:\\Users\\Michael\\code\\mikesshop.net")
    sys.path.append("C:\\Users\\Michael\\code\\mikesshop.net\\python\\app")
    sys.path.append("C:\\Users\\Michael\\code\\mikesshop.net\\python\\app\\models")
    print("Configuring client")
    clearDatabase()
    loadDatabase('output.csv',False)
    return app.test_client()

