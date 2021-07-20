import React from 'react';
import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import { withRouter } from 'next/router'
import pageLayout from '../../../components/pagelayout'
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import { Typography, Space } from 'antd';


const { Text, Link } = Typography;
class TopicList extends React.Component {
    constructor({query})
    {
        super();
        this.api = new ForumApi();
        this.state = {loaded:false};
    }
    async componentDidMount() {
        var threaddata = await this.api.getThreadInfo(this.props.query.slug);
        console.log(threaddata);
        var commentdata = await this.api.getPostList(this.props.query.slug);
        if (commentdata)
        {
            var retval = []
            var arrayLength = commentdata.length;
            for (var i = 0; i < arrayLength; i++) {
                //Do something
                //var processedContent = await remark().use(html).process(commentdata[i].text);
                //var contentHtml = processedContent.toString();
                //retval.push({'user':commentdata[i].user,'text':contentHtml,'timestamp':commentdata[i].timestamp});
            }
            //var threadretval = {}
            //var processedContent = await remark().use(html).process(threaddata.content);
            ///var contentHtml = processedContent.toString();
            //threadretval['content'] = contentHtml
            //threadretval['timestamp'] = threaddata.timestamp
            //threadretval['subject'] = threaddata.subject
            //threadretval['user'] = threaddata.user
            //retval.push({'user':commentdata[i].user,'text':contentHtml,'timestamp':commentdata[i].timestamp});

            
            console.log("commentdata");
            console.log(threaddata);
            console.log(retval);
            this.setState({commentdata: retval,threaddata: threadretval,loaded:true});
            
        }
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
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }
	render() {

        return (
            <>
                <div id="uniq">
                    {(this.state && this.state.loaded && this.state.threaddata) ? (
                        <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                            <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={18}>
                                <Row>
                                    <Col span={4}>User: {this.state.threaddata.user ? this.state.threaddata.user.name : 'NoUser'}</Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col>
                                            <div dangerouslySetInnerHTML={{__html: this.state.threaddata.content}}></div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col><Text type="secondary">Posted {this.timeConverter(this.state.threaddata.timestamp)}</Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ) : ( 
                       <></> 
                     )}
                {(this.state && this.state.loaded) ? (this.state.commentdata.map((value,index) => {
                    console.log("Newval: " + value);
                    return (
                        <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                            <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={18}>
                                <Row>
                                    <Col span={4}>User: {value.user ? value.user.name : 'NoUser'}</Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col>
                                            <div dangerouslySetInnerHTML={{__html: value.text}}></div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col><Text type="secondary">Posted {this.timeConverter(value.timestamp)}</Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    );
                })) : (<></>)}
                </div>
                <div id="postpost">
                    Post new post content here
                </div>
            </>
        )
	}
}
export default withRouter(TopicList);