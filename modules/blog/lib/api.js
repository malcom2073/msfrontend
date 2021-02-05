import { create } from 'apisauce'
import Router from 'next/router'
import MsModuleApi from'../../../lib/msmoduleapi'

export default class BlogApi extends MsModuleApi {
    constructor(serverside=false)
    {
        super('/blog',serverside); // Pass through the blog endpoint
    }
    getPosts = async () => {
        const response = await this.api.get('/getPosts');
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
        return response.data.data;
    }
    getPost = async (postid) => {
      const response = await this.api.get('/getPost',{'postid' : postid});
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
      return response.data.data;
  }

  setPostPublished = async (postid,published) => {
    const response = await this.api.post('/publishPost',{'postid' : postid,'published':published});
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

  editPost = async (postid,title,content) => {
    const response = await this.api.post('/editPost',{ 'id':postid,'title': title,'content': content});            
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
    return;
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