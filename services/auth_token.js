// services/auth_token.ts

import jwtDecode from "jwt-decode";

import Cookie from "js-cookie";
import Router from "next/router";

const TOKEN_STORAGE_KEY = "myApp.authToken";

//export type DecodedToken = {
//  readonly email: string;
//  readonly exp: number;
//}

export class AuthToken {

  constructor(token) {
    // we are going to default to an expired decodedToken
    this.decodedToken = { email: "", exp: 0 };
    this.token = token;

    // then try and decode the jwt using jwt-decode
    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
    }
  }

  authorizationString() {
    return `Bearer ${this.token}`;
  }

  expiresAt() {
    return new Date(this.decodedToken.exp * 1000);
  }

  isExpired() {
    return new Date() > this.expiresAt();
  }

  isValid() {
    return !this.isExpired() && this.token;
  }

  static getCookie(name,cookies) {
    var nameEQ = name + "=";
   var ca = cookies.split(';');
   for(var i=0;i < ca.length;i++) {
       var c = ca[i];
       while (c.charAt(0)==' ') c = c.substring(1,c.length);
       if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
   }
   return null;
}

  static fromNext(req) {
    if (req && req.headers.cookie) {
        var authcookie = AuthToken.getCookie(TOKEN_STORAGE_KEY,req.headers.cookie);
        return new AuthToken(authcookie);
    }
    else
    {
        return new AuthToken(Cookie.get(TOKEN_STORAGE_KEY));
        console.log('Bad! No server!');
        return new AuthToken(null);
    }
  }

  static storeToken(token) {
    Cookie.set(TOKEN_STORAGE_KEY, token);
  }

}