from conftest import client
from conftest import PASSWORD
import json
import pprint


forumindex = [
    {
        'id' : 1,
        'title' : 'General Discussion',
        'desc': 'General discussion forum, for general topics' 
    },
    {
        'id' : 2,
        'title' : 'Support',
        'desc': 'General support requests forum, for support for specific stuff' 
    },
    {
        'id' : 3,
        'title' : 'Suggestions',
        'desc': 'Suggestion forum. Post your suggestions here!'
    }
]

def test_forums_noauth(client):
    rv = client.get('/private')
    jsonresponse = json.loads(rv.data)
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')

def test_forums_withgoodauth(client):
    rv = client.get('/private')
    jsonresponse = json.loads(rv.data)
    # Verify we get a null session
    assert (jsonresponse['status'] == 'error' and jsonresponse['error'] == 'Null session')
    rv = client.post('/auth/auth',json={ 'username': 'Malcom', 'password': PASSWORD })
    print("Auth:")
    print(rv.data)
    jsonresponse = json.loads(rv.data)
    # Verify the password worked.
    assert jsonresponse['status'] == 'success'

# Test inserting forums based on the forumindex variable above!
def test_forums_insert(client):
    # Grab a token and cookie
    rv = client.post('/auth/auth',json={ 'username': 'Malcom', 'password': PASSWORD })
    jsonresponse = json.loads(rv.data)
    assert jsonresponse['status'] == 'success'
    assert 'access_token' in jsonresponse
    accesstoken = jsonresponse['access_token']
    assert 'Set-Cookie' in rv.headers
    cookie = rv.headers['Set-Cookie']
    rv = client.get('/userinfo',headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken})
    pprint.pprint(rv.data)
    jsonresponse = json.loads(rv.data)
    assert 'data' in jsonresponse
    assert 'name' in jsonresponse['data'] and jsonresponse['data']['name'] == 'Malcom'
    # We're good now to request to add forums!
    for obj in forumindex:
        rv = client.post('/addForum',
            headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
            json={'index':obj['id'],'title':obj['title'],'desc':obj['desc']})
        jsonresponse = json.loads(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
        pprint.pprint(rv.data)
    #assert False

# Test to make sure the index in the database matches the test forumindex
def test_forum_index(client):
    rv = client.get('/getForumList')
    pprint.pprint(rv.data)
    jsonresponse = json.loads(rv.data)
    assert 'data' in jsonresponse and 'status' in jsonresponse and jsonresponse['status'] == 'success'
    #assert jsonresponse['data'] == forumindex
    for index in forumindex:
        print(index)
        found = False
        for obj in jsonresponse['data']:
            print("Object")
            print(obj)
            if obj['id'] == index['id']:
                assert obj['title'] == index['title']
                assert obj['desc'] == index['desc']
                found = True
        assert found

        pprint.pprint(obj)
    assert False