import { create } from 'apisauce'
import Router from 'next/router'


export default class ForumApi extends Object {
    constructor()
    {
        super();
        var headers = { Accept: 'application/vnd.github.v3+json'}
        this.api = create({
            baseURL: 'http://localhost:3000',
            headers: headers
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
    async getPostList(topicid)
    {
        const response = await this.api.get('/api/getPostList', {'topicid' : topicid});
        console.log(response);
        if (response.problem) {
            switch (response.problem) {
              case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                  alert('Invalid credentials');
                  return 
                  //Bad authentication!
                }
                break;
              default:
                  break;
            }
            alert('Unknown error');
        }
        return response.data
    }
    async getTopicList(forumid)
    {
        const response = await this.api.get('/api/getForumTopics', {'forumid' : forumid});
        console.log(response);
        if (response.problem) {
            switch (response.problem) {
              case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                  alert('Invalid credentials');
                  return 
                  //Bad authentication!
                }
                break;
              default:
                  break;
            }
            alert('Unknown error');
        }
        return response.data
    }    
}