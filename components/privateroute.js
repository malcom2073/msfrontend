import React, { Component } from "react";
import { AuthToken } from "../services/auth_token";
import Router from 'next/router'

export function privateRoute(WrappedComponent) {
  return class extends Component{
    state = {
      auth: new AuthToken(this.props.token)
    };

    static async getInitialProps({pathname,query,req,res}) {
      // Grab the auth token from the cookies. req only exists on server
      // TODO: Make this work on client for <Link> redirects.
      const auth = AuthToken.fromNext(req);
      const initialProps = {auth: auth , token: auth.token, req:req, res:res};
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
      if (WrappedComponent.getInitialProps) {
        const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
        return { ...wrappedProps, auth };
      }
      return initialProps;
    }

    componentDidMount() {
      //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
      this.setState({ auth: new AuthToken(this.props.auth.token) })
    }

    render() {
      //Grab auth from this.state instead of from props, this ensures we get an actual instance of AuthToken instead of a JSON representation of it
      //We may not need to do this...
      const { auth, ...propsWithoutAuth } = this.props;
      return <WrappedComponent auth={this.state.auth} {...propsWithoutAuth} />;
    }
  };
}