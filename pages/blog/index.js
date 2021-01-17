import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import { AuthToken } from '../../services/auth_token'
import Forum_Index from '../../components/forums'
import { Row, Col, Button, Divider  } from 'antd';
import remark from 'remark'
import gfm from 'remark-gfm'
import html from 'remark-html'
import Link from 'next/link'

import { Typography, Space } from 'antd';
const { Text, Title } = Typography;


class BlogList extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = { loaded:false}
    }
    async componentDidMount() {
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        const api = create({
            baseURL: process.env.REACT_APP_MSAPI_ENDPOINT,
            headers: headers,
            });
        const response = await api.get('/api/blog/getPosts');
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

        var retval = []
        var arrayLength = response.data.data.length;
        for (var i = 0; i < arrayLength; i++) {
            //Do something
            var processedContent = await remark().use(html).use(gfm).process(response.data.data[i].content);
            var contentHtml = processedContent.toString();
            retval.push({'id':response.data.data[i].id,'user':response.data.data[i].user,'title':response.data.data[i].title,'content':contentHtml,'timestamp':response.data.data[i].timestamp});
        }
        this.setState({bloglist: retval,loaded:true})
    }
    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + (hour < 10 ? "0" + hour : hour) + ':' + (min < 10 ? "0" + min : min) + ':' + (sec < 10 ? "0" + sec : sec) ;
        return time;
        }
    render() {
    return (
        <>
        {(this.props.auth && this.props.auth.isValid() ? (
            <Row justify="center">
                <Col span={12}>
                <Link href={"/blog/create"}><Button>New Post</Button></Link>
                </Col>
            </Row>
            ) : (
                <></>
        ))}   
        {this.state && this.state.loaded && (this.state.bloglist.map((value,index) => {
                console.log("Blog Index List: " + value);
                return (
                    <>
                    <Row key={"r-" + index} style={{padding: "20px"}} gutter={[16, 24]}  justify="center">
                        <Col span={16}>
                            <Row justify="center">
                                <Col span={16}>
                                    <Title><Link href={"/blog/" + value.id}>{value.title}</Link></Title>
                                </Col>
                            </Row>
                            <Row justify="center">
                                <Col span={8} offset={8}>
                                    <Text type="secondary">Posted {this.timeConverter(value.timestamp)}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </>
                );
            }))}
             
        </>
    );
    }

}
export default pageLayout(BlogList);