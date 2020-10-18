import {Container, Row, Col} from 'react-bootstrap';
import MsNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import LoginForm from '../components/loginform'



export default function Login({navBar,query}) {
  console.log('Query');
  console.log(query);
    return (
    <>
    <Container fluid>
      <MsNavbar navBar={navBar}/>
      <Row>
      <Col></Col>
      <Col></Col>
          <Col align-items="center">
            <LoginForm next={query.next}></LoginForm>
</Col>
<Col></Col>
<Col></Col>
      </Row>
    </Container>
    </>
    )
}
export async function getServerSideProps(ctx) {
    const navBar = await getUserNavbar(ctx);
    var query = ctx.query;
    return {
      props: {
        // props for your component
        navBar, 
        query
      }
    }
  }
  