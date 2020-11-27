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
    async getForumList()
    {
        const response = await this.api.get('/api/getForums');
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
        return response.data.data

    }
    async getPostList(topicid)
    {
        const response = await this.api.get('/api/getComments', {'topicid' : topicid});
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
        return response.data.data
    }
    async getTopicList(forumid)
    {
        const response = await this.api.get('/api/getThreads', {'forumid' : forumid});
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
        return response.data.data
    }    
}