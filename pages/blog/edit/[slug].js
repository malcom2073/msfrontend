import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../components/pagelayout'
import privateRoute from '../../../components/privateroute'
import { AuthToken } from '../../../services/auth_token'
import Router from 'next/router'
import Forum_Index from '../../../components/forums'
//import Editor from '../../../components/markdowneditor'
import { Row,Form, Input, Button, Checkbox, DatePicker,TimePicker } from 'antd';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

//import { Editor } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
//import EditorV2 from '../../../components/markdowneditorv2';

import { Alert } from 'antd';

const moment = require('moment');
import EditorV2 from '../../../components/markdowneditorv2'
//import EditorV3 from '../../../components/markdowneditorv3'
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

import BlogApi from '../../../modules/blog/lib/api'
  
class BlogEdit extends React.Component {
    constructor(props) {
        super(props);
        console.log("BlogEditProps");
        console.log(props);
        console.log("EndBlogEditProps");
        this.myRef = React.createRef();
        this.titleRef = React.createRef();
        this.timeRef = React.createRef();
        this.dateRef = React.createRef();
        this.state = {loaded:false}
        this.saveNotificaitonTimer = null;
        this.api = new BlogApi();
    }
    componentDidMount = async () => {
        var token = AuthToken.fromNext();
        var headers = { Accept: 'application/vnd.github.v3+json'};
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        const api = create({
            baseURL: process.env.REACT_APP_MSAPI_ENDPOINT,
            headers: headers,
            });
        if (this.props.query.slug == -1)
        {
            var user_id = -1;
            if (token && token.decodedToken && token.decodedToken.sub)
            {
                user_id = token.decodedToken.sub.user_id;
            }
            var timestamp = Date.now() / 1000 | 0;
            const response = await api.post('/api/blog/posts',{ 'userid':user_id,'title': 'Title', 'timestamp':timestamp,'content': ''});
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
        }
        Router.push('/blog/edit/' + response.data.postid);
        return;
            
            //this.setState({postid:response.data.postid,published: false, savedcontent: '', savedtitle: 'Title',loaded:true,posttext: ''});
            //this.titleRef.current.input.value = 'Title';
        }
        else
        {

        //console.log("BlogEdit ComponentDidMount");
        const response = await api.get('/api/blog/posts/' + this.props.query.slug);
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
        console.log(response);

        if (response.data.status == "failure")
        {
            alert('Failure: ' + response.data.error);
            return;
        }
        //if (this.myref && this.myref.current)
        //{
        //this.myRef.current.getInstance().setMarkdown(response.data.data.content);
        //}
        var timestampmoment = moment(response.data.post.timestamp*1000.0);

        this.setState({loaded:true});
        this.setState({savedtimestamp:timestampmoment,timestamp:timestampmoment,postid:this.props.query.slug,published: response.data.post.published, savedcontent: response.data.post.content, savedtitle: response.data.post.title,loaded:true,posttext: response.data.post.content});
        //this.myRef.current.setValue(response.data.data.content)
        this.titleRef.current.input.value = response.data.post.title;
        }
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
        Router.push('/blog/' + this.state.postid);
    }
    onPublish = async e => {
        if (this.state.changed) {
            //We need to save prior to setting publish, since state has hcanged
        }
        this.api.setPostPublished(this.state.postid,true);
        this.setState({published:true});

    }
    onSaveAndUnpublish = async e => {
        this.api.setPostPublished(this.state.postid,false);
        this.setState({published:false});

    }
    onUnPublish = async e => {
        //Don't save changes! Just unpublish
        this.api.setPostPublished(this.state.postid,false);
        this.setState({published:false});

    }
    onSubmit = async e => {
        var result = await this.api.editPost(this.state.postid,this.state.timestamp.unix(),this.state.savedtitle,this.state.savedcontent);
        console.log(result);
        if (result === true)
        {
            console.log("onsubmit success");
        this.setState({savedtimestamp:this.state.timestamp,alertmsg: "Saved...",alerttype:"success",savedalert: true,changed: false,savedtext: this.state.posttext});
        }
        else
        {
            console.log("onsubmit failure");
            this.setState({savedtimestamp:this.state.timestamp,alertmsg:"Error Saving: " + result,alerttype:"error",savedalert:true,changed: false,savedtext: this.state.posttext});
        }
        this.saveNotificaitonTimer = setTimeout(()=>this.setState({savedalert:false}),3000);
        //Router.push('/blog/' + this.props.query.slug);
        return;
    }
    componentWillUnmount = () => {
        if (this.saveNotificaitonTimer) {
            clearInterval(this.saveNotificaitonTimer);
        }
    }
    onDateChange = (time,timeString) => {
//        if (time != this.state.timestamp) {
//            this.setState({changed:true});
//        }
//        else {
//            this.setState({savedtitle: text,changed:false});
//        }
        this.setState({timestamp:time,changed:true});
        //this.timeRef.current.value = time;
        console.log(time);
        console.log(timeString);
    }
    onTimeChange = (time,timeString)=>{
        this.setState({timestamp:time,changed:true});
        //this.dateRef.current.value = time;
        console.log(time);
        console.log(timeString);

    }
	render = () => {
                
        return (
            <>
            {(this.state && this.state.savedalert) ? (
                <Alert message={this.state.alertmsg} type={this.state.alerttype} />
            ) : (
                <></>
            )}
            {(this.state && this.state.loaded) ? (
                <>
                Title:
                <Input value={this.state.savedtitle} onChange={this.onTitleChange.bind(this)} ref={this.titleRef}/>
                Date:
                <DatePicker value={this.state.timestamp} onChange={this.onDateChange.bind(this)} ref={this.dateRef}/>
                <TimePicker value={this.state.timestamp} onChange={this.onTimeChange.bind(this)} ref={this.timeRef}/>
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