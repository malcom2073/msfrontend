import { AuthToken } from "../services/auth_token";
import { create } from 'apisauce'
import Router from 'next/router'


export default class MsApi extends Object {
    constructor()
    {
        super();
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        this.api = create({
            baseURL: 'http://localhost:3000',
            headers: headers,
        });
    }
    async refreshToken() {
        const response = await this.api.post('/api/refresh');
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
        localStorage.setItem('jwt_auth',response.data.access_token);
        AuthToken.storeToken(response.data.access_token);
    }
    // Returns a JSON of info for the currently logged in user.
    async getUserInfo() {
        const response = await this.api.get('/api/userinfo');
        console.log('UserInfoResponse');
        console.log(response);
        // TODO: Handle more of these errors.
        if (response.problem) {
          switch (response.problem) {
            case 'CLIENT_ERROR':
              if (response.status == 401)
              {
                  // TOOD: Figure out how we want to handle this redirect.
                  // Since the API is used on several pages, should it push the error response back to the page?
                  // If so, need a generic way for pages to handle auth errors and redirect to login.
                Router.push('/login?next=/')
                //alert('Invalid credentials');
                return null
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
}