import { create } from 'apisauce'
import { AuthToken } from "../services/auth_token";
import { useRouter } from 'next/router'
import Router from 'next/router'
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
export default class LoginForm extends React.Component {
    constructor(props)
    {
        super(props);
    }
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({[e.target.name]: e.target.value});
    }
    onSubmit = async e => {
        console.log(e);
        const api = create({
            baseURL: process.env.REACT_APP_MSAPI_ENDPOINT,
            headers: { Accept: 'application/json' },
        })
        const response = await api.post('/api/auth/auth',{ username: e.username, password: e.password});
        console.log(response);
        // TODO: Handle more of these errors.
        if (response.problem) {
            switch (response.problem) {
            case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    if (response.data)
                    {
                        console.log("SADFASDFSAFDSAFD");
                        console.log(this.props);
                        if (this.props.onError)
                        {
                        this.props.onError(response.data.error);
                        }
                        else
                        {
                        alert(response.data.error);
                        }
                    }
                    else
                    {
                    alert('Invalid credentials');
                    }
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
            <Form name="basic" onFinish={this.onSubmit.bind(this)}>
            <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
        >
        <Input />
        </Form.Item>

        <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        >
        <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
            </Form>          
        );
    }
}