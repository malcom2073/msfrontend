import { create } from 'apisauce'
import Router from 'next/router'
import MsModuleApi from'../../../lib/msmoduleapi'

export default class BlogApi extends MsModuleApi {
    constructor(serverside=false)
    {
        super('/blog',serverside); // Pass through the blog endpoint
    }
    getPosts = async () => {
        this.refreshToken();

        const response = await this.api.get('/posts');
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
        return response.data.posts;
    }
    getPost = async (postid) => {
        this.refreshToken();

      const response = await this.api.get('/posts/' + postid);
        console.log(response);
        console.log(process.env.MSAPI_ENDPOINT);
      if (response.problem) {
          switch (response.problem) {
              case 'CLIENT_ERROR':
              if (response.status == 401)
              {
                  //alert('Invalid credentials');
                  return 
                  //Bad authentication!
              }
              break;
              default:
                  break;
          }
          //alert('Unknown error');
          return;
      }
      return response.data.post;
  }

  setPostPublished = async (postid,published) => {
    this.refreshToken();
    const response = await this.api.patch('/posts/' + postid,{'published':published});
    //console.log(response);
    if (response.problem) {
        switch (response.problem) {
            case 'CLIENT_ERROR':
            if (response.status == 401)
            {
                //alert('Invalid credentials');
                return 
                //Bad authentication!
            }
            break;
            default:
                break;
        }
        //alert('Unknown error');
        return;
    }
    return response.data.data;
}

  editPost = async (postid,timestamp,title,content) => {
    const response = await this.api.patch('/posts/' + postid,{ 'id':postid,'timestamp':timestamp,'title': title,'content': content},{ headers: this.refreshToken() });
    //const response = await this.api.post('/editPost',{ 'id':postid,'timestamp':timestamp,'title': title,'content': content});
    //console.log(response);
    if (response.problem) {
        switch (response.problem) {
            case 'CLIENT_ERROR':
            if (response.status == 401)
            {
                //alert('Invalid credentials');
                return "Invalid Credentials"
                //Bad authentication!
            }
            break;
            default:
                break;
        }
        //alert('Unknown error');
        return "Unknown Error";
    }
    return true;
}

    async getThreadInfo(topicid)
    {
      const response = await this.api.get('/api/forum/getThread', {'threadid' : topicid});
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
        const response = await this.api.get('/api/forum/getComments', {'topicid' : topicid});
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
        const response = await this.api.get('/api/forum/getThreads', {'forumid' : forumid});
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