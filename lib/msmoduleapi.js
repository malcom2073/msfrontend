import { AuthToken } from "../services/auth_token";
import { create } from 'apisauce'

export default class MsModuleApi extends Object {
    constructor(path,serverside=false)
    {
        super();
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        //if (token) {
        //    headers.Authorization = token.authorizationString();
        //}
        if (serverside) {
            this.api = create({
                baseURL: 'http://localhost:5000/api' + path,
                headers: headers,
            });
        }
        else {
            this.api = create({
                baseURL: "/api" + path,
                headers: headers,
            });
        }
    }
    refreshToken = () => {
        var token = AuthToken.fromNext()
        //var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            
            var headers = { Accept: 'application/vnd.github.v3+json', Authorization: token.authorizationString()};
            this.api.setHeaders(headers);
            return headers
        }
        return null;
    }
}
