import React from 'react';
import pageLayout from '../components/pagelayout'
import LoginForm from '../components/loginform'
import { Space, Row, Col} from 'antd';
import { Alert } from 'antd';



class LoginPage extends React.Component {
    constructor(props)
    {
        super(props);
    }

    onLoginError = (msg) => {
        this.setState({alertmsg:msg,alerttype:"error"});
    }
    render = () => {
        console.log('Query');
        console.log(this.props.query);
        return (
        <>
        <Row justify="space-around" align="middle">
            <Col span={4} align-items="center">
            {(this.state && this.state.alertmsg) ? (
            <Alert message={this.state.alertmsg} type={this.state.alerttype} />
            ) : (
                <></>
            )}

                {(this.props.query && this.props.query.next) ? (
                <LoginForm next={this.props.query.next} onError={this.onLoginError.bind(this)}></LoginForm>
                ) : (
                    <LoginForm onError={this.onLoginError.bind(this)}></LoginForm>
                )}
            </Col>
        </Row>
        </>
        )    
    }
}
export default pageLayout(LoginPage);