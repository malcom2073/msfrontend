import json
from flask import Flask, jsonify
app = Flask(__name__)
@app.route('/')
def index():
    return jsonify({'name': 'alice',
                    'email': 'alice@outlook.com'})


@app.route('/getAllPostIds')
def getAllPostIds():
    return jsonify([
        {
            'params': {
                'ids': 'ssg-ssr'
            }
        },
#        {
#            'params' : {
#                'ids': 'pre-rendering'
#            }
#        }
    ])

    
@app.route('/getNavbar')
def getNavbar():
    return jsonify({
        'menuleft' : [
        {
            'title':  'Home',
            'link': '/',
            'type':'link'
        },
        {
            'title':  'Forum',
            'link': '/forum',
            'type':'link'
        },
        {
            'title':  'Status',
            'link': '/status',
            'type':'link'
        },
        
#        {
#            'params' : {
#                'ids': 'pre-rendering'
#            }
#        }
    ],
    'menuright' : [
{
            'title':  'Guest',
            'type':'dropdown',
            'links': [
                {
                    'title': 'Login',
                    'type':'link',
                    'link' : '/login'
                },
                {
                    'title': '',
                    'type':'divider'
                },
                {
                    'title': 'Sign-Up',
                    'type':'link',
                    'link' : '/signup'
                }
            ]
        },
    ]})

app.run()


