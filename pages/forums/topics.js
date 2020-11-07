import { Row, Col } from 'antd';
import ForumApi from '../../modules/forum/lib/api'

class Forum_Index extends React.Component {
		constructor(props)
		{
                super(props);
                this.props = props;
                this.state = {loading:true}
                this.api = new ForumApi();
        }
        async componentDidMount() {
            
            topicdata = await this.api.getTopicData(this.props.topicid);
            this.setState({loading:false});
        }
	render() {
	return (
		<>
			Topic List!s
            <div id="uniq">
            {(this.state && this.state.loading) ? (
            )}
            {(this.api.getForumList().map((value) => {
                console.log("Newval: " + value);
                return (
                    <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                        <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={12}>
                            <Row>
                                {value}
                            </Row>
                            <Row>
                                <Col span={4}>Topic name</Col>
                                <Col span={20}>Description of the forums</Col>

                            </Row>
                        </Col>
                    </Row>
                );
            }))}
            </div>
		</>
	)
	}
}
export default Forum_Index;