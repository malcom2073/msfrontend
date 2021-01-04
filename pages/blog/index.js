import { create } from 'apisauce'
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import { AuthToken } from '../../services/auth_token'
import Forum_Index from '../../components/forums'
import { Row, Col } from 'antd';
import remark from 'remark'
import html from 'remark-html'
import Link from 'next/link'

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
			var processedContent = await remark().use(html).process(response.data.data[i].content);
			var contentHtml = processedContent.toString();
			retval.push({'id':response.data.data[i].id,'user':response.data.data[i].user,'title':response.data.data[i].title,'content':contentHtml,'timestamp':response.data.data[i].timestamp});
		}
        this.setState({bloglist: retval,loaded:true})
        }
	render() {
	return (
		<>
		 {this.state && this.state.loaded && (this.state.bloglist.map((value,index) => {
                console.log("Blog Index List: " + value);
                return (
                    <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
						<Col span={3}>
							<Link href={"/blog/edit/" + value.id}> Edit</Link>
						</Col>
                        <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={16}>
                            <Row>
                                <Col span={4}>                                    
                                        {value.title}
                                </Col>
                                <Col span={20}>
                                </Col>    
                            </Row>
                            <Row>
                                <Col span={4}></Col>
                                <Col span={20}>
								<div dangerouslySetInnerHTML={{__html: value.content}}></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                );
            }))}
		</>
	)
	}

}
export default pageLayout(BlogList);