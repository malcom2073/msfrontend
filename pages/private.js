import {Container, Row, Col} from 'react-bootstrap';
import MsNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../components/privateroute";
import { render } from 'react-dom';


class Private extends React.Component {
  render() {
  return (
  <>
  <Container fluid>
    <MsNavbar navBar={this.props.navBar}/>
    <Row>
    Private stuff here!
    {this.props.auth.isValid() ?  'This is valid!' : 'Invalid'}
    More text
    {this.props.auth.token}
    Last Text
    </Row>
  </Container>
  </>
  )
  }
  static async getInitialProps(ctx) {
    const navBar = await getUserNavbar()
    return { navBar: navBar }
  }
  
}

export default privateRoute(Private);