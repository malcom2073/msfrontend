import {Container, Row, Col} from 'react-bootstrap';
import MSNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../components/privateroute";
import { render } from 'react-dom';
import { AuthToken } from "../services/auth_token";
import MsApi from '../lib/msapi';
import Router from 'next/router'

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
      <Row>
      <Col>
      Email: { (this.state.profile) ? (this.state.profile.email) : ("Loading...")}<br/>
      Last IP : { (this.state.profile) ? (this.state.profile.lastip) : ("Loading...")}<br/>
      
      </Col>
      </Row>
    </Container>
    </>
  )
  }
  async componentDidMount() {
    console.log(this.state.auth);
    var msapi = new MsApi();
    var profileobj = await msapi.getUserInfo();
    //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
    this.setState({ auth: new AuthToken(this.props.auth.token) ,profile:profileobj })
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