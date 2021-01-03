from conftest import client
from conftest import PASSWORD
from conftest import USER
import json
import pprint
import datetime

blogposts = [
    {
        'id':0,
        'title' : 'This is my first blog post',
        'date': (datetime.datetime.now()-datetime.timedelta(days=2)).timestamp(),
        'content': '**Markup Content of blog post**'
    }
]

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
def test_blog_addPost(client):
    print("*******************RUNNING TEST_BLOG_ADDPOST********************")
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
    #for obj in forumindex:
    #    rv = client.post('/forum/addForum',
    #        headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
    #        json={'index':obj['id'],'title':obj['title'],'desc':obj['desc']})
    #    jsonresponse = json.loads(rv.data)
    #    assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
    #    pprint.pprint(rv.data)
    ##assert False

