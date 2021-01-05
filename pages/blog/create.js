import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import privateRout from '../../components/privateroute'
import { AuthToken } from '../../services/auth_token'
import Router from 'next/router'
import Forum_Index from '../../components/forums'
import Editor from '../../components/markdowneditor'
import { Row,Form, Input, Button, Checkbox } from 'antd';

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  
class BlogCreate extends React.Component {
		constructor(props)
		{
				super(props);
        }
        
        onEditorChange = (value) => {
            const text = value();
            console.log("Create Blog SubClass:");
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
              var user_id = -1;
              if (token && token.decodedToken && token.decodedToken.sub)
              {
                  user_id = token.decodedToken.sub.user_id;
              }
              const response = await api.post('/api/blog/addPost',{ 'title': '', 'date':timestamp,'user': user_id,'content': this.state['posttext']});
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
            Router.push('/blog');
            return;
        
        }
	render() {
	return (
		<>
        <Form name="basic" onFinish={this.onSubmit}>
        <Editor onEditorChange={this.onEditorChange}/>
          <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
          </Form>
		</>
	)
	}

}
export default privateRoute(pageLayout(BlogCreate));