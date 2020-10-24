import {Container, Row, Col} from 'react-bootstrap';
import MSNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../components/privateroute";
import { render } from 'react-dom';
import { create } from 'apisauce'
import { AuthToken } from "../services/auth_token";
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
    var token = AuthToken.fromNext()
    var headers = { Accept: 'application/vnd.github.v3+json'}
    if (token) {
        headers.Authorization = token.authorizationString();
    }
    const api = create({
      baseURL: 'http://localhost:3000',
      headers: headers,
    })    
    const response = await api.get('/api/userinfo');
    console.log('UserInfoResponse');
    console.log(response);
    var profileobj = null;
    // TODO: Handle more of these errors.
    if (response.problem) {
      switch (response.problem) {
        case 'CLIENT_ERROR':
          if (response.status == 401)
          {
            Router.push('/login?next=' + pathname)
            //alert('Invalid credentials');
            return {}
            //Bad authentication!
          }
          break;
        default:
            break;
      }
      alert('Unknown error');
    }
    else {
      profileobj = response.data.data;
    }
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