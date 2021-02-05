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

import { Alert } from 'antd';


import EditorV2 from '../../../components/markdowneditorv2'
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

import BlogApi from '../../../modules/blog/lib/api'
  
class BlogEdit extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.titleRef = React.createRef();
        this.state = {loaded:false}
        this.saveNotificaitonTimer = null;
        this.api = new BlogApi();
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
        this.setState({published: response.data.data.published, savedcontent: response.data.data.content, savedtitle: response.data.data.title,loaded:true,posttext: response.data.data.content});
        //this.myRef.current.setValue(response.data.data.content)
        this.titleRef.current.input.value = response.data.data.title;
        //console.log("BlogEdit ComponentDidMount DONE");
    }
    onEditorChange = (value) => {
        const text = value;
        //console.log("Create Blog SubClass:");
        //console.log(text);
        if (text != this.state.savedcontent) {
            this.setState({savedcontent: text,changed:true});
        }
        else {
            this.setState({savedcontent: text,changed:false});
        }
    }
    onTitleChange = (value) => {
        var text = value.target.value
        if (text != this.state.savedtitle) {
            this.setState({savedtitle: text,changed:true});
        }
        else {
            this.setState({savedtitle: text,changed:false});
        }
    }
    onCancel = async e => {
        Router.push('/blog/' + this.props.query.slug);
    }
    onPublish = async e => {
        if (this.state.changed) {
            //We need to save prior to setting publish, since state has hcanged
        }
        this.api.setPostPublished(this.props.query.slug,true);
        this.setState({published:true});

    }
    onSaveAndUnpublish = async e => {
        this.api.setPostPublished(this.props.query.slug,false);
        this.setState({published:false});

    }
    onUnPublish = async e => {
        //Don't save changes! Just unpublish
        this.api.setPostPublished(this.props.query.slug,false);
        this.setState({published:false});

    }
    onSubmit = async e => {
        this.api.editPost(this.props.query.slug,this.state.savedtitle,this.state.savedcontent);
        this.setState({savedalert: true,changed: false,savedtext: this.state.posttext});
        this.saveNotificaitonTimer = setTimeout(()=>this.setState({savedalert:false}),3000);
        //Router.push('/blog/' + this.props.query.slug);
        return;
    }
    componentWillUnmount = () => {
        if (this.saveNotificaitonTimer) {
            clearInterval(this.saveNotificaitonTimer);
        }
    }

	render = () => {
        return (
            <>
            {(this.state && this.state.savedalert) ? (
                <Alert message="Success Text" type="success" />
            ) : (
                <></>
            )}
            {(this.state && this.state.loaded) ? (
                <>
                Title:
                <Input value={this.state.savedtitle} onChange={this.onTitleChange.bind(this)} ref={this.titleRef}/>
                <EditorV2 content={this.state.posttext} ref={this.myRef} onChange={this.onEditorChange.bind(this)}/>
                </>
            ) : (
                <></>
            )}
            {(this.state && this.state.changed) ? (
                (this.state.published) ? (
                    <>
                    <Button type="primary" onClick={this.onSubmit}>
                    Save
                </Button>
                <Button type="primary" onClick={this.onSaveAndUnpublish}>
                Save and Unpublish
            </Button>
            </>
                ) : (
                    <>
                    <Button type="primary" onClick={this.onSubmit}>
                    Save Draft
                </Button>
                <Button type="primary" onClick={this.onPublish}>
                Save and Publish
            </Button>
            </>
                    )
    ) : (
        (this.state.published) ? (
            <>
                            <Button type="primary" onClick={this.onCancel}>
                    Close
                </Button>
        <Button type="primary" onClick={this.onUnPublish}>
        Unpublish
    </Button>
    </>
        ) : (
            <>
        <Button type="primary" onClick={this.onSubmit}>
            Close
        </Button>
        <Button type="primary" onClick={this.onPublish}>
            Publish
        </Button>
    </>
            )

            )}
            </>
        )
	}
}
export default privateRoute(pageLayout(BlogEdit));