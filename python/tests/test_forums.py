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
    assert False


# Test to make sure the index in the database matches the test forumindex
def test_forum_index(client):
    rv = client.get('/getForumList')
    pprint.pprint(rv.data)
    jsonresponse = json.loads(rv.data)
    assert 'data' in jsonresponse and 'status' in jsonresponse and jsonresponse['status'] == 'success'
    assert jsonresponse['data'] == forumindex
    for obj in jsonresponse['data']:
        for index in forumindex:
            if obj['id'] == index['id']:
                assert obj['title'] == index['title']
                assert obj['desc'] == index['desc']
        pprint.pprint(obj)
    assert False