import React from 'react';
import { create } from 'apisauce'
import { AuthToken } from '../../../services/auth_token'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { Row,Form, Input, Button, Checkbox } from 'antd';

import Editor from './editor.js'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
export default class CreateComment extends React.Component {
  
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({[e.target.name]: e.target.value});
      }
      onEditorChange = (value) => {
        const text = value();
        console.log("CreateComment SubClass:");
        console.log(text);
        this.setState({'posttext': text});
      }
    onSubmit = async e => {
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        const api = create({
            baseURL: process.env.REACT_APP_MSAPI_ENDPOINT,
            headers: headers,
          });
          var timestamp = Date.now() / 1000 | 0;
          var user_id = token.decodedToken.sub.user_id;
          const response = await api.post('/api/forum/addComment',{ 'thread_id': this.props.query.slug, 'timestamp':timestamp,'user': user_id,'text': this.state['posttext']});
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
        Router.push('/forums/forum/' + this.props.query.slug);
        return;
    
    }
    
    render() {
      this.nextUrl = this.props.next;
/*        return (
            <>
            <Row>
            <Form name="basic" onFinish={this.onSubmit}>
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
          </Row>
          <Row> 
          <Editor/>
</Row>
</>
        );*/
        return (
          <Form name="basic" onFinish={this.onSubmit}>
          <Editor onEditorChange={this.onEditorChange}/>
          <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
          </Form>
        );
      }
}