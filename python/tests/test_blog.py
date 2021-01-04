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
        'content': '**Markup Content of blog post**',
        'tags': [ 'new', 'blog', 'tech']
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
    rv = client.post('/blog/addPost',
        headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
        json={'id':0,'title':'','date':'','content':'','tags':['new','blog','tech']})
    jsonresponse = json.loads(rv.data)
    pprint.pprint(jsonresponse)
    assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
    # We're good now to request to add forums!
    #for obj in forumindex:
    #    rv = client.post('/forum/addForum',
    #        headers={'Set-Cookie':cookie,'Authorization':'Bearer ' + accesstoken},
    #        json={'index':obj['id'],'title':obj['title'],'desc':obj['desc']})
    #    jsonresponse = json.loads(rv.data)
    #    assert 'status' in jsonresponse and jsonresponse['status'] == 'success'
    #    pprint.pprint(rv.data)
    ##assert False

