import {Form, Button} from 'react-bootstrap';
import { create } from 'apisauce'
import { AuthToken } from "../services/auth_token";
import { useRouter } from 'next/router'
import Router from 'next/router'

export default class LoginForm extends React.Component {
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({[e.target.name]: e.target.value});
      }
    onSubmit = async e => {
        e.preventDefault();
        const api = create({
          baseURL: 'http://localhost:3000',
          headers: { Accept: 'application/vnd.github.v3+json' },
        })
        const response = await api.post('/api/auth',{ username: this.state['user'], password: this.state['pass']});
        console.log(response);
        // TODO: Handle more of these errors.
        if (response.problem) {
          switch (response.problem) {
            case 'CLIENT_ERROR':
              if (response.status == 401)
              {
                alert('Invalid credentials');
                return {}
                //Bad authentication!
              }
              break;
            default:
                break;
          }
          alert('Unknown error');
        }
        console.log(response.data)
        console.log(this.props.next);    
        localStorage.setItem('jwt_auth',response.data.access_token);
        AuthToken.storeToken(response.data.access_token);
        if (this.props.next) {
          Router.push(this.props.next);
        }
        else {
          Router.push('/');
        }
        
    
        return;
    
    }
    
    render() {
      this.nextUrl = this.props.next;
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
}