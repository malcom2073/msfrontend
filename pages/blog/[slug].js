import React from 'react';
import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import privateRoute from '../../components/privateroute'
import { AuthToken } from '../../services/auth_token'
import Router from 'next/router'
//import ModalImage from "react-modal-image";
import Forum_Index from '../../components/forums'
import { Row,Col, Form, Input, Button, Checkbox,List } from 'antd';
import Link from 'next/link'
//import ReactMarkdown from 'react-markdown'  
//import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Modal } from 'antd';
import BlogApi from '../../modules/blog/lib/api'
import ReactDOMServer from 'react-dom/server'
var toc = require('markdown-toc-unlazy');
var uslug = require('uslug');
import EditorV4 from '../../components/markdowneditorv4'

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
import { Typography } from 'antd';

const { Title, Text } = Typography;
const generateId = (() => {
    let i = 0;
    return (prefix = '') => {
      i += 1;
      return `${prefix}-${i}`;
    };
  })();
class BlogView extends React.Component {
    constructor(props) {
        super(props);
        this.api = new BlogApi();
        console.log("BlogView::ctor");
        console.log(props);
        //this.editorRef = React.createRef();
        this.state = {blogdata:""}
    }

    static async getInitialProps(ctx) {
        //MetaData Set here
        var api = null;
        if (ctx.req)
        {
            api = new BlogApi(true);
        }
        else {
            api = new BlogApi(false);
        }
        var response = await api.getPost(ctx.query.slug);
        console.log("blog getinitialprops");
        console.log(ctx.query);
        console.log(response);
        if (!response)
        {
            return { meta: {
                title: "",
                description: "MikesShop.net ",
                keywords: "blog mikesshop malcom2073 cars computers technology"
            },
            title:'',
            blogdata: ''
        }
        }
        //textoutput += `\n\`\`\``;
        //console.log(textoutput);
        //this.setState({title: response.data.data.title, blogdata: response.data.data.content.replace("__TOC__",textoutput),loaded:true})
        //this.setState({title: response.data.data.title, blogdata: response.data.data.content.replace("__TOC__",toccontent.content),loaded:true})

        return { meta: {
            title: "" + response.title,
            description: "MikesShop.net " + response.title,
            keywords: "blog mikesshop malcom2073 cars computers technology"
        },
        title:response.title,
        blogdata: response.content
    }
      }

    componentDidMount = async () => {
        var response = await this.api.getPost(this.props.query.slug);
        console.log("blog componentDidmount");
        if (response == null)
        {
            Router.push("/blog");
            return;
        }
        this.setState({blogdata: response.content});
        console.log(response);
        //if (this.editorRef.current)
        //{
        //this.editorRef.current.dangerouslySetInnerHtml = response.content;
        //}

    }
    
    render = () => {
        console.log("blog render");
        console.log(this.state.blogdata);
        return (
        <>
            <Row justify="center">
            {//(this.state && this.state.loaded ? (
             //   <Title>{this.state.title}</Title>
            //) : (
             //   <></>
            //))
        }    
        <Title>{this.props.title}</Title>
            </Row>
            <Row justify="center">
                <Col span={10} >
                <div dangerouslySetInnerHTML={{__html: this.state.blogdata}}/>
                </Col>
                {(this.props.auth && this.props.auth.isValid() ? (
                <Col span={1}>
                    <Link href={"/blog/edit/" + this.props.query.slug + "?test=something"}>Edit Post</Link>
                </Col>
                ) : (
                    <></>
                ))}
            </Row>
        </>
        )
    }
}
export default pageLayout(BlogView);