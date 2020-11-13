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
  

export default Logout;