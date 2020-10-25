import {Container, Row, Col, Table} from 'react-bootstrap';
import MSNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../components/privateroute";
import { render } from 'react-dom';
import { AuthToken } from "../services/auth_token";
import MsApi from '../lib/msapi';

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
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>User</td>
                  <td>{this.props ? ( this.props.user.user ) : ( 'No User' ) }</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{ (this.state.profile) ? (this.state.profile.email) : ("Loading...")}</td>
                </tr>
                <tr>
                  <td>Last IP</td>
                  <td>{ (this.state.profile) ? (this.state.profile.lastip) : ("Loading...")}</td>
                </tr>
                <tr>
                  <td>Group</td>
                  <td>{ (this.state.profile) ? (this.state.profile.group.name) : ("Loading...")}</td>
                </tr>
                <tr>
                  <td>Registered</td>
                  <td>{ (this.state.profile) ? (this.state.profile.registered) : ("Loading...")}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col>
          </Col>
      </Row>
      <Row>
      <Col>
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