import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import privateRoute from '../../components/privateroute'
import { AuthToken } from '../../services/auth_token'
import Router from 'next/router'
import Forum_Index from '../../components/forums'
import { Row,Col, Form, Input, Button, Checkbox,List } from 'antd';
import remark from 'remark'
import gfm from 'remark-gfm'
import html from 'remark-html'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//import { coy } from "react-syntax-highlighter/dist/styles/prism";
import {coy} from "react-syntax-highlighter/dist/cjs/styles/prism/prism"
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
import { Typography } from 'antd';

const { Title, Text } = Typography;

const renderers = {
    heading: function Heading(props) {
        return <Title level={props.level}>{props.children}</Title>;
    },
    list: function MakeList(props) {
        return <List bordered>{props.children}</List>
    },  
    listItem: function MakeListItem(props) {
        return <List.Item>{props.children}</List.Item>
    },
    inlineCode: function makeInlineCode(props) {
        return  <Text code>{props.children}</Text>
    },
    code: function makeCodeBlock(props) {
        return <SyntaxHighlighter language={props.language} style={coy}>{props.value}</SyntaxHighlighter>
    },
    blockquote: function makeBlockQuote(props) {
        return <Text type="secondary">{props.children}</Text>
    }
};
class BlogView extends React.Component {
    constructor({query}) {
        super();
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
        const response = await api.get('/api/blog/getPost',{'postid' : this.props.query.slug});
        console.log(response);
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
        
        this.setState({title: response.data.data.title, blogdata: response.data.data.content,loaded:true})
    }
    
	render = () => {
        return (
        <>
            <Row justify="center">
            {(this.state && this.state.loaded ? (
                <Title>{this.state.title}</Title>
            ) : (
                <></>
            ))}    
            </Row>
            <Row justify="center">
                <Col span={10} >
                {(this.state && this.state.loaded ? (
                    <ReactMarkdown renderers={renderers} plugins={[gfm]} children={this.state.blogdata} />
                ) : (
                    <></>
                ))}
                </Col>
                {(this.props.auth && this.props.auth.isValid() ? (
                <Col span={1}>
                    <Link href={"/blog/edit/" + this.props.query.slug}>Edit Post</Link>
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