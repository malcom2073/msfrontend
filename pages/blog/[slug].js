import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import privateRoute from '../../components/privateroute'
import { AuthToken } from '../../services/auth_token'
import Router from 'next/router'
import Forum_Index from '../../components/forums'
import { Row,Col, Form, Input, Button, Checkbox } from 'antd';
import remark from 'remark'
import gfm from 'remark-gfm'
import html from 'remark-html'
import Link from 'next/link'

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
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
        //if (this.myref && this.myref.current)
        //{
        //this.myRef.current.getInstance().setMarkdown(response.data.data.content);
        //}
        //this.setState({'posttext': response.data.data.content});
        //this.myRef.current.setValue(response.data.data.content)

        var processedContent = await remark().use(html).use(gfm).process(response.data.data.content);
        var contentHtml = processedContent.toString();
        this.setState({blogdata: contentHtml,loaded:true})
    }
    
	render = () => {
        return (
            <>
                <Row justify="center">
      <Col span={12} offset={6}>
            {(this.state && this.state.loaded ? (
                <div dangerouslySetInnerHTML={{__html: this.state.blogdata}}></div>
            ) : (
                <></>
            ))}
      </Col>
    </Row>
            </>
        )
	}
}
export default pageLayout(BlogView);