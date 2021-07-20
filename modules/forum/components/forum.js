import React from 'react';
import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import { withRouter } from 'next/router'
import pageLayout from '../../../components/pagelayout'
import Link from 'next/link'
class ForumList extends React.Component {
    constructor({query})
    {
        super();
        this.api = new ForumApi();
        this.state = {loaded:false};
    }
    async componentDidMount() {
        
        var topicdata = await this.api.getTopicList(this.props.query.slug);
        if (topicdata)
        {
            this.setState({topicdata: topicdata,loaded:true});
        }        
    }
	render() {
        return (
            <>
                <div id="uniq">
                {(this.state && this.state.loaded) ? (this.state.topicdata.map((value,index) => {
                    console.log("Newval: " + value);
                    return (
                        <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                            <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={24}>
                                <Row>
                                    <Col span={4}>
                                    <Link key={"/forums/topic/" + value.id} href={"/forums/topic/" + value.id}>
                                            {value.subject}
                                        </Link>
                                    </Col>
                                    <Col span={20}></Col>
                                </Row>
                                <Row>
                                    <Col span={4}></Col>
                                    <Col span={20}>{value.content}</Col>

                                </Row>
                            </Col>
                        </Row>
                    );
                })) : (<></>)}
                </div>

            </>
        )
	}
}
export default withRouter(ForumList);