import {Form, Button} from 'react-bootstrap';
import { create } from 'apisauce'
import { AuthToken } from "../services/auth_token";
import { useRouter } from 'next/router'


export default class LoginForm extends React.Component {
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
      
        console.log(`${e.target.name} = ${e.target.value}`);
        this.setState({[e.target.name]: e.target.value});
        console.log(this.state);
      }
    onSubmit = async e => {
        e.preventDefault();
        console.log(e);
        console.log(this.state['user']);
        console.log(this.state['pass']);
        const api = create({
          baseURL: 'http://localhost:3000',
          headers: { Accept: 'application/vnd.github.v3+json' },
        })
        const response = await api.post('/api/auth',{ username: this.state['user'], password: this.state['pass']});
        console.log(response);
        switch (response.problem) {
          case 'CLIENT_ERROR':
            if (response.status == 401)
            {
              return {}
              //Bad authentication!
            }
            break;
          default:
              break;
        }
        console.log(response.data)
        console.log(this.props.query);    
        localStorage.setItem('jwt_auth',response.data.access_token);
        AuthToken.storeToken(response.data.access_token);
    
        return;
    
    }
    
    render() {
        return (
            <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control name="user" type="text" onChange={this.onChange} placeholder="Enter Username" />
              {/*<Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>*/}
            </Form.Group>
          
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control name="pass" type="password" onChange={this.onChange} placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember Me" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>          
        );
      }
      static getInitialProps({query}) {
        return {query}
      }
}