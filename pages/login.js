import {Container, Row, Col} from 'react-bootstrap';
import MsNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'



export default function Login({navBar}) {
    return (
    <>
    <Container fluid>
      <MsNavbar navBar={navBar}/>
      <Row>
      <Col></Col>
      <Col></Col>
          <Col align-items="center">
            <LoginForm></LoginForm>
</Col>
<Col></Col>
<Col></Col>
      </Row>
    </Container>
    </>
    )
}
export async function getServerSideProps(context) {
    const navBar = await getUserNavbar()
    return {
      props: {
        // props for your component
        navBar
      }
    }
  }
  