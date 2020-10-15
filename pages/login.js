import {Container, Row, Col} from 'react-bootstrap';
import MsNavbar from '../components/navbar'
import {getUserNavbar} from '../components/navbar'
import {Form, Button} from 'react-bootstrap';



const onSubmit = function(values) {
    values.preventDefault();
    console.log(values);
}

export default function Login({navBar}) {
    return (
    <>
    <Container fluid>
      <MsNavbar navBar={navBar}/>
      <Row>
      <Col></Col>
      <Col></Col>
          <Col align-items="center">
      <Form onSubmit={onSubmit}>
  <Form.Group controlId="formBasicUsername">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Enter Username" />
    {/*<Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>*/}
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>
  <Form.Group controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Remember Me" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
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
  