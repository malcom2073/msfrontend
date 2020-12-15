from conftest import client
from conftest import PASSWORD
from conftest import USER
import json
import pprint
import datetime

forumindex = [
    {
        'id' : 0,
        'parent':-1,
        'title' : "Forums",
        'desc': "Top Level Forum Object"
    },
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

threadindex = [
    {
        'id': 0,
        'parent': 1,
        'subject': "This is the title text of the first general post",
        'content':"This is the body text of the first general post!"
    },
    {
        'id': 1,
        'parent': 1,
        'subject': "This is the title text of the second general post",
        'content':"This is the body text of the second general post!"
    },
    {
        'id': 2,
        'parent': 1,
        'subject': "This is the title text of the third general post",
        'content':"This is the body text of the third general post!"
    },
    {
        'id': 3,
        'parent': 2,
        'subject': "This is the title text of the first support post",
        'content':"This is the body text of the first support post!"
    },
    {
        'id': 4,
        'parent': 2,
        'subject': "This is the title text of the second support post",
        'content':"This is the body text of the second support post!"
    },
    {
        'id': 5,
        'parent': 3,
        'subject': "This is the title text of the first suggestions post",
        'content':"This is the body text of the first suggestions post!"
    }    
]
commentindex = [
    {
        'id': 0,
        'thread':0,
        'user':16,
        'timestamp': (datetime.datetime.now()-datetime.timedelta(days=4)).timestamp(),
        'text':"This is the text of the first comment on the first post"
    },
    {
        'id': 1,
        'thread':0,
        'user':3,
        'timestamp': (datetime.datetime.now()-datetime.timedelta(days=3)).timestamp(),
        'text':"This is a second comment on the first post"
    },
    {
        'id': 2,
        'thread':0,
        'user':4,
        'timestamp': (datetime.datetime.now()-datetime.timedelta(days=2)).timestamp(),
        'text':"This is a third comment on the first post"
    },
    {
        'id': 3,
        'thread':1,
        'user':1,
        'timestamp': (datetime.datetime.now()-datetime.timedelta(days=4)).timestamp(),
        'text':"This is the text of the first  comment on the second post"
    },
    {
        'id': 4,
        'thread':1,
        'user':7,
        'timestamp': (datetime.datetime.now()-datetime.timedelta(days=3)).timestamp(),
        'text':"This is a second comment on the second post"
    },
    {
        'id': 5,
        'thread':1,
        'user':9,
        'timestamp': (datetime.datetime.now()-datetime.timedelta(days=2)).timestamp(),
        'text':"This is a third comment on the second post"
    }
]

# Test inserting forums based on the forumindex variable above!
def test_forums_addForum(client):
    print("*******************RUNNING TEST_FORUMS_ADDFORUM********************")
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
        rv = client.post('/forum/addForum',
            headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
            json={'index':obj['id'],'title':obj['title'],'desc':obj['desc']})
        jsonresponse = json.loads(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
        pprint.pprint(rv.data)
    #assert False


def util_forums_getForums(client):
    rv = client.get('/forum/getForums')
    pprint.pprint(rv.data)
    jsonresponse = json.loads(rv.data)
    assert 'status' in jsonresponse and jsonresponse['status'] == 'success' and  'data' in jsonresponse
    return jsonresponse['data']

# Test to make sure the index in the database matches the test forumindex
def test_forum_index(client):
    print("*******************RUNNING TEST_FORUM_INDEX********************")
    #assert jsonresponse['data'] == forumindex
    test_forums_addForum(client)
    forumList = util_forums_getForums(client)
    for index in forumindex:
        print(index)
        found = False
        for obj in forumList:
            print("Object")
            print(obj)
            if obj['id'] == index['id']:
                assert obj['title'] == index['title']
                assert obj['desc'] == index['desc']
                found = True
        assert found

        pprint.pprint(obj)

# Test inserting posts based on the threadindex variable above!
def test_forums_addThread(client):
    print("*******************RUNNING TEST_FORUMS_ADDTHREAD********************")
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
    for obj in threadindex:
        rv = client.post('/forum/addThread',
            headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
            json={'index':obj['id'],'parent':obj['parent'],'subject':obj['subject'],'content':obj['content']})
        jsonresponse = json.loads(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
        pprint.pprint(rv.data)
    #assert False


# Test to make sure the index in the database matches the test threadindex
def test_forum_threads(client):
    print("*******************RUNNING TEST_FORUM_THREADS********************")
    test_forums_addForum(client)
    test_forums_addThread(client)
    forumList = util_forums_getForums(client)
    foundcount = 0
    for obj in forumList:
        print("Forum" + str(obj))
        rv = client.get('/forum/getThreads?forumid=' + str(obj['id']))
        jsonresponse = json.loads(rv.data)
        print("/getThreads response")
        pprint.pprint(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success' and 'data' in jsonresponse
        for prethread in threadindex:
            if prethread['parent'] == obj['id']:
                found = False
                for thread in jsonresponse['data']:
                    if thread['id'] == prethread['id']:
                        assert thread['subject'] == prethread['subject']
                        assert thread['content'] == prethread['content']
                        foundcount+=1
                        found = True
                if not found:
                    pprint.pprint(prethread)
                assert found
    assert foundcount == len(threadindex)


# Test inserting posts based on the threadindex variable above!
def test_forums_addComment(client):
    print("*******************RUNNING TEST_FORUM_ADDCOMMENTS********************")
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
    for obj in commentindex:
        rv = client.post('/forum/addComment',
            headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
            json={'index':obj['id'],'thread':obj['thread'],'user':obj['user'],'timestmap':obj['timestamp'],'text':obj['text']})
        jsonresponse = json.loads(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
        pprint.pprint(rv.data)
    #assert False


# Test to make sure the index in the database matches the test threadindex
def test_forum_comments(client):
    print("*******************RUNNING TEST_FORUM_COMMENTS********************")
    test_forums_addForum(client)
    test_forums_addThread(client)
    test_forums_addComment(client)
    forumList = util_forums_getForums(client)
    foundcount = 0
    for obj in forumList:
        print("Forum" + str(obj))
        rv = client.get('/forum/getThreads?forumid=' + str(obj['id']))
        jsonresponse = json.loads(rv.data)
        print("/getThreads response")
        pprint.pprint(rv.data)
        assert 'status' in jsonresponse and jsonresponse['status'] == 'success' and 'data' in jsonresponse
        for thread in jsonresponse['data']:
            print("Thread" + str(thread))
            rv = client.get('/forum/getComments?topicid=' + str(thread['id']))
            threadjsonresponse = json.loads(rv.data)
            print("/getComments response")
            pprint.pprint(rv.data)
            for precomment in threadjsonresponse['data']:
                rv = client.get('/forum/getComment?commentid=' + str(precomment['id']))
                commentjsonresponse = json.loads(rv.data)
                print("/getComment response")
                pprint.pprint(rv.data)
                assert len(commentjsonresponse['data']) == 1
                for comment in commentindex:
                    if commentjsonresponse['data'][0]['id'] == comment['id']:
                        assert commentjsonresponse['data'][0]['text'] == comment['text']
                        foundcount+=1
    assert foundcount == len(commentindex)
    
