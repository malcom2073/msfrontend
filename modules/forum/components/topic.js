import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import { withRouter } from 'next/router'
import pageLayout from '../../../components/pagelayout'
class TopicList extends React.Component {
    constructor({query})
    {
        super();
        this.api = new ForumApi();
        this.state = {loaded:false};
    }
    async componentDidMount() {
        
        var topicdata = await this.api.getPostList(this.props.query.slug);
        if (topicdata)
        {
            this.setState({topicdata: topicdata,loaded:true});
        }
    }
	render() {
        return (
            <>
                Topic List!s
                <div id="uniq">
                {(this.state && this.state.loaded) ? (this.state.topicdata.map((value,index) => {
                    console.log("Newval: " + value);
                    return (
                        <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                            <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={12}>
                                <Row>
                                    <Col span={4}>{value.user}</Col>
                                    <Col span={20}></Col>
                                </Row>
                                <Row>
                                    <Col span={4}></Col>
                                    <Col span={20}>{value.text}</Col>

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
export default withRouter(TopicList);