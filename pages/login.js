import {Container, Row, Col} from 'react-bootstrap';
import MSNavbar from '../components/navbar'
import LoginForm from '../components/loginform'



export default function Login({query}) {
  console.log('Query');
  console.log(query);
    return (
    <>
    <Container fluid>
      <MSNavbar/>
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
    var query = ctx.query;
    return {
      props: {
        // props for your component
        query
      }
    }
  }
  