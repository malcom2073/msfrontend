import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import { withRouter } from 'next/router'
import pageLayout from '../../../components/pagelayout'
class Topic extends React.Component {
		constructor({query})
		{
                super();
                //this.props = props;
                this.api = new ForumApi();
                this.state = {loaded:false};
                //const router = useRouter()
              //const { topicid } = router.query
              /*if (query && query.slug)
              {
                this.state = {loading:false,topicdata: query.slug}
              }
              else
              {
                this.state = {loading:true}
              }*/
              //console.log("Topicdata1");
              //console.log(ctx);
        }
        async componentDidMount() {
            
            var topicdata = await this.api.getTopicList(this.props.query.slug);
            console.log("DidMount");
            console.log(topicdata);
            console.log(this.props);
            this.setState({topicdata: topicdata,loaded:true});
            //console.log("topicdata");
            //console.log(topicdata);
            
        }
        componentDidUpdate({router}) {
            //console.log("Component update");
            //console.log(this.state);
            //console.log(router);
            //if (this.state.loading && router.query && router.query.slug)
            //{
            //    console.log("Didupdate,Setting State");
            //    console.log(router.query.slug);
            //    this.setState({topicdata:router.query.slug,loading:false});
            //}
        }
        //static getInitialProps({query}) {
        //    return {query}
        //  }
	render() {
        console.log("Page Props");
        console.log(this.props);
        console.log(this.state);
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
                                <Col span={4}>{value.title}</Col>
                                <Col span={20}></Col>
                            </Row>
                            <Row>
                                <Col span={4}></Col>
                                <Col span={20}>{value.summary}</Col>

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
export default pageLayout(withRouter(Topic));