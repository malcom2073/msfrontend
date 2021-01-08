import {Container, Row, Col, Table} from 'react-bootstrap';
import MSNavbar from '../../../components/navbar'
import {getUserNavbar} from '../../../components/navbar'
import LoginForm from '../../../components/loginform'
import Link from 'next/link'
import { Form, Input, Checkbox } from 'antd';
import nextCookie from 'next-cookies'
import privateRoute from "../../../components/privateroute";
import { render } from 'react-dom';
import { AuthToken } from "../../../services/auth_token";
import MsApi from '../../../lib/msapi';
import pageLayout from '../../../components/pagelayout'
import { Button, DatePicker, version } from "antd";

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true};
    }
    onFinish = (values) => {
        console.log('Success:', values);
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    render = () => {
        console.log(this.props);
        return (
            <>
            Editing user {this.props.query.slug}
            <br/>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    value={this.state.userobj ? ( this.state.userobj.name ) : ( 'No User' ) }
                    >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Nickname"
                    name="nickname"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <br/>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <td><Button type="primary">Edit</Button></td>
                        <td>User</td>
                        <td>{this.state.userobj ? ( this.state.userobj.name ) : ( 'No User' ) }</td>
                    </tr>
                    <tr>
                    <td><Button type="primary">Edit</Button></td>
                        <td>Nickname</td>
                        <td>{this.state.userobj ? ( this.state.userobj.nickname ) : ( 'Loading...' ) }</td>
                    </tr>
                    <tr>
                    <td><Button type="primary">Edit</Button></td>
                        <td>Email</td>
                        <td>{ (this.state.userobj) ? (this.state.userobj.email) : ("Loading...")}</td>
                    </tr>
                    <tr>
                    <td><Button type="primary">Edit</Button></td>
                        <td>Last IP</td>
                        <td>{ (this.state.userobj) ? (this.state.userobj.lastip) : ("Loading...")}</td>
                    </tr>
                    <tr>
                    <td><Button type="primary">Edit</Button></td>
                        <td>Group</td>
                        <td>{ (this.state.userobj) ? (this.state.userobj.primary_group.name) : ("Loading...")}</td>
                    </tr>
                    <tr>
                    <td><Button type="primary">Edit</Button></td>
                        <td>Registered</td>
                        <td>{ (this.state.userobj) ? (this.state.userobj.registered_date) : ("Loading...")}</td>
                    </tr>
                </tbody>
                <Link href="/users">Cancel</Link>  <Link href="/users">Save</Link>
            </Table>
            </>
        )
    }
    componentDidMount = async () => {
        var msapi = new MsApi();
        var userobj = await msapi.getUser(this.props.query.slug);
        console.log("UserObject");
        console.log(userobj);
        this.setState({isLoading: false, userobj: userobj});

        //var profileobj = await msapi.getUserList();
        //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
        //this.setState({ isLoading: false,auth: new AuthToken(this.props.auth.token) ,profile:profileobj })
    }
}

export default privateRoute(pageLayout(EditUser));