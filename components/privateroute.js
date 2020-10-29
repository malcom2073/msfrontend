import React, { Component } from "react";
import { AuthToken } from "../services/auth_token";
import Router from 'next/router'
import MsApi from '../lib/msapi'

export function privateRoute(WrappedComponent) {
  return class extends Component{
    state = {
      auth: new AuthToken(this.props.token)
    };
    props = {};
    apichecktimer = null;
    static async getInitialProps({pathname,query,req,res}) {
      // Grab the auth token from the cookies. req only exists on server
      // TODO: Make this work on client for <Link> redirects.
      const auth = AuthToken.fromNext(req);
      const initialProps = {auth: auth, token: auth.token, pathname: pathname};
      //console.log(initialProps);
      //Check for expired auth. This should likely be replaced with valid
      //We can do some logic here for refresh tokens if we want to handle "remember me" boxes.
      if (auth.isExpired()) {
          console.log("hey! server says you shouldnt be here! you are not logged in!");
          if (res)
          {
            res.writeHead(302, {location: '/login?next=' + req.url})
            res.end()
          return {}; // Return nothing, since we should be redirecting.
          }
          else
          {
            console.log('inital props query');
            console.log(req);
            console.log(res);
            console.log(pathname);
            //We're on client
            Router.push('/login?next=' + pathname)
          }
      }
      else {
        initialProps.user = auth.decodedToken.sub;
      }
      //if (WrappedComponent.getInitialProps) {
      //  const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
      //  return { ...wrappedProps, auth };
      //}
      return initialProps;
    }

    componentDidMount() {
      console.log(this.props.auth);
      //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
      this.setState({ auth: new AuthToken(this.props.auth.token) })
      console.log('ComponentDidMount*****************');
      console.log(this.props);
      this.apichecktimer = setInterval(function() { this.checkAuth(); }.bind(this),5000); //Check every 5 seconds
    }
    componentWillUnmount() {
      clearInterval(this.apichecktimer);
    }
    checkAuth() {
      const token = AuthToken.fromNext();
      var currdate = new Date();
      var tokendate = new Date(token.decodedToken.exp * 1000)
      if (token &&  currdate > tokendate) {
        Router.push('/login?next=' + this.state.pathname);
      }
      else
      {
        if (token) {
          tokendate.setSeconds(tokendate.getSeconds() - 60);
          if (currdate > tokendate) {
            // Token is not yet expired, but is within 1 minute of expiring. Refresh it.
            var api = new MsApi();
            api.refreshToken();
          }
        console.log(new Date(token.decodedToken.exp * 1000));
        }
        else
        {
          Router.push('/login?next=' + this.state.pathname);
        }
      }
    }

    render() {
      //Grab auth from this.state instead of from props, this ensures we get an actual instance of AuthToken instead of a JSON representation of it
      //We may not need to do this...
      const { auth, ...propsWithoutAuth } = this.props;
      return <WrappedComponent auth={this.state.auth} {...propsWithoutAuth} />;
    }
  };
}
