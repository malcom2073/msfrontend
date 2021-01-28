import { AuthToken } from "../services/auth_token";
import { create } from 'apisauce'

export default class MsModuleApi extends Object {
    constructor(path)
    {
        super();
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        this.api = create({
            baseURL: process.env.REACT_APP_MSAPI_ENDPOINT + path,
            headers: headers,
        });
    }
}