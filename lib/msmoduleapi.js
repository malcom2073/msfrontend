import { AuthToken } from "../services/auth_token";
import { create } from 'apisauce'

export default class MsModuleApi extends Object {
    constructor(path,serverside=false)
    {
        super();
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        if (serverside) {
            this.api = create({
                baseURL: 'http://nginx:8080/api' + path,
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
}
