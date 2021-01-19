import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../components/pagelayout'
import privateRoute from '../../../components/privateroute'
import { AuthToken } from '../../../services/auth_token'
import Router from 'next/router'
import Forum_Index from '../../../components/forums'
//import Editor from '../../../components/markdowneditor'
import { Row,Form, Input, Button, Checkbox } from 'antd';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

//import { Editor } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
//import EditorV2 from '../../../components/markdowneditorv2';

import EditorV2 from '../../../components/markdowneditorv2'
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  
class BlogEdit extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.titleRef = React.createRef();
    }
    componentDidMount = async () => {
        //console.log("BlogEdit ComponentDidMount");
        var token = AuthToken.fromNext();
        var headers = { Accept: 'application/vnd.github.v3+json'};
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        const api = create({
            baseURL: process.env.REACT_APP_MSAPI_ENDPOINT,
            headers: headers,
            });
        const response = await api.get('/api/blog/getPost',{'postid' : this.props.query.slug});
        //console.log(response);
        if (response.problem) {
            switch (response.problem) {
                case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    alert('Invalid credentials');
                    return 
                    //Bad authentication!
                }
                break;
                default:
                    break;
            }
            alert('Unknown error');
        }
        //if (this.myref && this.myref.current)
        //{
        //this.myRef.current.getInstance().setMarkdown(response.data.data.content);
        //}
        this.setState({'posttext': response.data.data.content});
        this.myRef.current.setValue(response.data.data.content)
        this.titleRef.value = response.data.data.title;
        //console.log("BlogEdit ComponentDidMount DONE");
    }
    onTitleChange = (e) => {
        console.log('handle change called')
      }
    onEditorChange = (value) => {
        const text = value;
        //console.log("Create Blog SubClass:");
        //console.log(text);
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
            const response = await api.post('/api/blog/editPost',{ 'id':this.props.query.slug,'title': this.titleRef.value,'content': this.state['posttext']});
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
	render = () => {
        return (
            <>
            <Form name="basic" onFinish={this.onSubmit}>
                Title: <input onChange={(e) => {this.onTitleChange(e)}} ref={(myref) => {this.titleRef = myref}}/>
                <EditorV2 ref={this.myRef} onChange={this.onEditorChange}/>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
            </>
        )
	}
}
export default privateRoute(pageLayout(BlogEdit));