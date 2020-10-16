// services/auth_token.ts

import jwtDecode from "jwt-decode";

import Cookie from "js-cookie";
import Router from "next/router";

const TOKEN_STORAGE_KEY = "myApp.authToken";

export class AuthToken {

  constructor(token) {
    // we are going to default to an expired decodedToken
    this.decodedToken = { email: "", exp: 0 };
    // Save the token, ok to be null
    this.token = token;
    // Decode it using jwt-decode
    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
    }
  }

  // Returns the string that http requests to the API can use for Authorization header
  authorizationString() {
    return `Bearer ${this.token}`;
  }

  // Returns js date when the token expires
  expiresAt() {
    return new Date(this.decodedToken.exp * 1000);
  }

  // Checks to see if the token is expired yet
  isExpired() {
    return new Date() > this.expiresAt();
  }

  // Returns valid only if the token exists, and also is not expired.
  // TODO: Check validity of server signature here, since this is used on both sides
  isValid() {
    return !this.isExpired() && this.token;
  }

  // Hackity hack-hack to get the cookies. I'm sure there's a library for this, but I couldn't find
  // a convenient one that I liked. This snippet is from some stackoverflow I can't find again.
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

  // Get the auth token from cookies, if we're on server (req only exists on server)
  // And get it from local cookie storage otherwise.
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

  // The login page uses this to store the cookie in a known location
  // TODO: Does this need to be done serverside too? It's not httponly, so maybe not?
  static storeToken(token) {
    Cookie.set(TOKEN_STORAGE_KEY, token);
  }

}