import {Container, Row, Col} from 'react-bootstrap';
import MsNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import Router from 'next/router'
import { create } from 'apisauce'

import { AuthToken } from "../services/auth_token";

class Logout extends React.Component {
    render() {
        return (
        <>
        </>
        )
    }
    componentDidMount = async () => {
        //AuthToken.clearToken();
        AuthToken.clearToken();
        
        Router.push('/');
    }
};
export const getServerSideProps = async (ctx) => {
    //Logout on client side. This ensures that we tell the server we're logging out
    //This will clear the httponly cookie in the browser by pinging the 
    // TODO: Actually log out on serverside to ensure the client can't just comment out the above line, and still access restricted endpoints.
    return { props: {}};
    console.log('Cookies!');
    console.log(ctx.req.headers.cookie);
    var token = AuthToken.fromNext(ctx.req)
    var headers = { Accept: 'application/vnd.github.v3+json'}
    if (token) {
        headers.Authorization = token.authorizationString();
    }
    headers.cookie = ctx.req.headers.cookie;
    const api = create({
        baseURL: 'http://localhost:3000',
        headers: headers,
      })
      const response = await api.post('/api/logout');
      switch (response.problem) {
        case 'CLIENT_ERROR':
          if (response.status == 401)
          {
              console.log('Bad Auth');
            return {}
            //Bad authentication!
          }
          break;
        default:
            break;
      }
    //AuthToken.clearToken();
    return { props: {}};
}
  

export default Logout;