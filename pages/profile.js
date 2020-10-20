import {Container, Row, Col} from 'react-bootstrap';
import MSNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../components/privateroute";
import { render } from 'react-dom';

class Profile extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = props;
    }
  render() {
      console.log(this.props);
  return (
    <>
    <Container fluid>
        <MSNavbar/>
      <Row>
          <Col>
          </Col>
          <Col>
          User profile {this.props ? ( this.props.user.user ) : ( 'No User' ) }
          </Col>
          <Col>
          </Col>
      </Row>
    </Container>
    </>
  )
  }
  static async getInitialProps(ctx) {
      //return ctx;
    //const navBar = await getUserNavbar(ctx)
    //this.setState({navBar:navBar});
    //return { navBar: navBar }
  //  return {}
  }
}

export default privateRoute(Profile);