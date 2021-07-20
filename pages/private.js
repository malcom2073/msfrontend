import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import MSNavbar from '../components/navbar'
//import {getUserNavbar} from '../components/navbar'
//import MSNavBar from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import privateRoute from "../components/privateroute";
import { render } from 'react-dom';
import pageLayout from '../components/pagelayout'


class Private extends React.Component {
  //constructor(props) {
    //super(props)
  //}
  render() {
  return (
  <>
  <Container fluid>
    <Row>
    Private stuff here!
    {this.props.auth && this.props.auth.isValid() ?  'This is valid!' : 'Invalid'}
    More text
    {this.props.auth && this.props.auth.token}
    Last Text
    </Row>
  </Container>
  </>
  )
  }
  
}

export default privateRoute(pageLayout(Private));
