import { create } from 'apisauce'
import Router from 'next/router'


export default class ForumApi extends Object {
    constructor()
    {
        super();
        this.api = create({
            baseURL: 'http://localhost:3000'
        });
    }
    getForumList()
    {
        var forumlist = [
            {
                "id":0,
                "title":"General Discussion",
                "description":"Discussion about anything that doesn't fall into other categories"
            },
            {
                "id":1,
                "title":"Support",
                "description":"Support requests and help"
            },
            {
                "id":2,
                "title":"Tutorials",
                "description":"Tutorials and self-help topics"
            }];
        return forumlist;
    }
    getPostList(topicid)
    {
        if (topicid == 0)
        {
            //GD - Topic1
            return [
                {
                    "id":1,
                    "user":"Malcom",
                    "date":12345678,
                    "text": "This is the text of the first post on this topic!"
                },
                {
                    "id":2,
                    "user":"Mike",
                    "date":12345678,
                    "text": "First response! Yay!"
                }
                ,
                {
                    "id":3,
                    "user":"Mike",
                    "date":12345678,
                    "text": "I had some more to say. I had some more to say. I had some more to say. I had some more to say. I had some more to say. Lorum Ipsum or some stuff like that?"
                }
                ,
                {
                    "id":4,
                    "user":"Malcom",
                    "date":12345678,
                    "text": "What're you babbling about?"
                }
                ,
                {
                    "id":5,
                    "user":"Mike",
                    "date":12345678,
                    "text": "Nothing"
                }
            ]
        }
    }
    getTopicList(forumid)
    {
        if (forumid == 0)
        {
            return [
                {
                    "id":0,
                    "title":"GD - Topic1",
                    "summary":"This is a summary of the first topic. It will contain the text form the topic..."
                },
                {
                    "id":1,
                    "title":"GD - Topic2",
                    "summary":"This summary is for the second topic, it will be about the same length as the..."
                }];
                    
        }
        else if (forumid == 1)
        {
            return [
                {
                    "id":2,
                    "title":"Support - Topic 1",
                    "summary":"Suport topic number 1, is the first support topic in the forums, and as such ..."
                },
                {
                    "id":3,
                    "title":"Support - Topic 2",
                "summary":"Summary for support topic number 2! Second of the stupport topics, but just as help..."
                }];
        }
        else if (forumid == 2)
        {
            return ["Tut - Topic 1","Tut - Topic 2", "Tut - Topic 3"];
        }
    }
    
}