import { NextPageContext } from "next";
import React, { Component } from "react";
import { AuthToken } from "../services/auth_token";
//import { redirectToLogin } from "../services/redirect_service";

//export type AuthProps = {
//  token: string
//}

export function privateRoute(WrappedComponent) {
  return class extends Component{
    state = {
      auth: new AuthToken(this.props.token)
    };

    static async getInitialProps({req,res}) {
      // create AuthToken
      //const auth = localStorage.getItem('jwt_token');
      const auth = AuthToken.fromNext(req);
      console.log(auth);
      const initialProps = {auth: auth , token: auth.token};
      // if the token is expired, that means the user is no longer (or never was) authenticated
      // and if we allow the request to continue, they will reach a page they should not be at.
      if (auth.isExpired) {
          console.log("hey! server says you shouldnt be here! you are not logged in!");
          res.writeHead(302, {location: '/login?next=' + req.url})
          res.end()
      }
      if (WrappedComponent.getInitialProps) {
        const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
        // make sure our `auth: AuthToken` is always returned
        return { ...wrappedProps, auth };
      }
      return initialProps;
    }

    componentDidMount() {
        console.log('We loaded!');
        console.log(this.props);
      // since getInitialProps returns our props after they've JSON.stringify
      // we need to reinitialize it as an AuthToken to have the full class
      // with all instance methods available
      this.setState({ auth: new AuthToken(this.props.auth.token) })
    }

    render() {
      // we want to hydrate the WrappedComponent with a full instance method of
      // AuthToken, the existing props.auth is a flattened auth, we want to use
      // the state instance of auth that has been rehydrated in browser after mount
      const { auth, ...propsWithoutAuth } = this.props;
      return <WrappedComponent auth={this.state.auth} {...propsWithoutAuth} />;
      //return <WrappedComponent {...this.props} />;
    }
  };
}