from conftest import client
from conftest import PASSWORD
from conftest import USER
import json
import pprint


forumindex = [
    {
        'id' : 1,
        'parent':0,
        'title' : "General Discussion",
        'desc': "General discussion forum, for general topics"
    },
    {
        'id' : 2,
        'parent':0,
        'title' : "Support",
        'desc': "General support requests forum, for support for specific stuff"
    },
    {
        'id' : 3,
        'parent':0,
        'title' : "Suggestions",
        'desc': "Suggestion forum. Post your suggestions here!"
    },
    {
        'id' : 4,
        'parent':1,
        'title' : "General Subforum #1",
        'desc': "It's a general forum, but in subforum format!"
    },
    {
        'id' : 5,
        'parent':1,
        'title' : "General Subforum #2",
        'desc': "It's another subforum in the general forum format"
    }
]

topicindex = [
    {
        'id': 0,
        'parent': 1,
        'title': "This is the title text of the first general post",
        'text':"This is the body text of the first general post!"
    },
    {
        'id': 1,
        'parent': 1,
        'title': "This is the title text of the second general post",
        'text':"This is the body text of the second general post!"
    },
    {
        'id': 2,
        'parent': 1,
        'title': "This is the title text of the third general post",
        'text':"This is the body text of the third general post!"
    },
    {
        'id': 3,
        'parent': 2,
        'title': "This is the title text of the first support post",
        'text':"This is the body text of the first support post!"
    },
    {
        'id': 4,
        'parent': 2,
        'title': "This is the title text of the second support post",
        'text':"This is the body text of the second support post!"
    },
    {
        'id': 5,
        'parent': 3,
        'title': "This is the title text of the first suggestions post",
        'text':"This is the body text of the first suggestions post!"
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
    rv = client.post('/auth/auth',json={ 'username': USER, 'password': PASSWORD })
    print("Auth:")
    print(rv.data)
    jsonresponse = json.loads(rv.data)
    # Verify the password worked.
    assert jsonresponse['status'] == 'success'

# Test inserting forums based on the forumindex variable above!
def test_forums_insert(client):
    # Grab a token and cookie
    rv = client.post('/auth/auth',json={ 'username': USER, 'password': PASSWORD })
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
    assert 'name' in jsonresponse['data'] and jsonresponse['data']['name'] == USER
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

# Test inserting posts based on the topicindex variable above!
def test_forums_insert_posts(client):
    # Grab a token and cookie
    rv = client.post('/auth/auth',json={ 'username': USER, 'password': PASSWORD })
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
    assert 'name' in jsonresponse['data'] and jsonresponse['data']['name'] == USER
    # We're good now to request to add forums!
    for obj in topicindex:
        rv = client.post('/addThread',
            headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
            json={'index':obj['id'],'parent':obj['parent'],'title':obj['title'],'text':obj['text']})
        jsonresponse = json.loads(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
        pprint.pprint(rv.data)
    #assert False


# Test to make sure the index in the database matches the test topicindex
def test_forum_threads(client):
    #test_forums_insert(client)
    rv = client.get('/getForumList')
    print("/getForumList response")
    pprint.pprint(rv.data)
    jsonresponse = json.loads(rv.data)
    assert 'data' in jsonresponse and 'status' in jsonresponse and jsonresponse['status'] == 'success'
    #assert jsonresponse['data'] == forumindex
    foundcount = 0
    for obj in jsonresponse['data']:
        print("Forum" + str(obj))
        rv = client.get('/getForumTopics?forumid=' + str(obj['id']))
        jsonresponse = json.loads(rv.data)
        print("/getForumTopics response")
        pprint.pprint(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success' and 'data' in jsonresponse
        for prethread in topicindex:
            if prethread['parent'] == obj['id']:
                found = False
                for thread in jsonresponse['data']:
                    if thread['id'] == prethread['id']:
                        assert thread['title'] == prethread['title']
                        assert thread['text'] == prethread['text']
                        foundcount+=1
                        found = True
                if not found:
                    pprint.pprint(prethread)
                assert found
    assert foundcount == len(topicindex)

