import {Container, Row, Col} from 'react-bootstrap';
import MsNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../components/privateroute";
import { render } from 'react-dom';


class Private extends React.Component {
  Private() {
    this.state = {navBar:null, isLoading: true}
  }
  render() {
  return (
  <>
  <Container fluid>
    {this.state && this.state.isLoading ? (
      <div>Loading...</div>
    ) : (
      this.state && this.state.navBar ? (
      <MsNavbar navBar={this.state.navBar}/>
      ) : (
        <div>Loading...</div>
      )
    )}
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
  async componentDidMount() {
    const navBar = await getUserNavbar(null);
    this.setState({navBar:navBar,isLoading: false});

  }
  static async getInitialProps(ctx) {
    //const navBar = await getUserNavbar(ctx)
    //this.setState({navBar:navBar});
    //return { navBar: navBar }
    return {}
  }
  
}

export default privateRoute(Private);