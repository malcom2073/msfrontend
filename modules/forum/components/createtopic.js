import { create } from 'apisauce'
import { AuthToken } from '../../../services/auth_token'
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
export default class CreateTopic extends React.Component {
  
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({[e.target.name]: e.target.value});
      }
    onSubmit = async e => {
        console.log(e);
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        const api = create({
            baseURL: 'http://localhost:3000',
            headers: headers,
          });
          const response = await api.post('/api/addThread',{ parent: this.props.query.forum, title: e.subject,text: e.posttext});
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
        Router.push('/forums/forum/' + this.props.query.forum);
        return;
    
    }
    
    render() {
      this.nextUrl = this.props.next;
        return (
            <Form name="basic" onFinish={this.onSubmit}>
            <Form.Item
        label="Subject"
        name="subject"
        rules={[{ required: true, message: 'Please enter a topic subject' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Post Text"
        name="posttext"
        rules={[{ required: true, message: 'Please input your post!' }]}
      >
        <Input.TextArea rows={8} />
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