import { Row, Col } from 'antd';
import ForumApi from '../../modules/forum/lib/api'
import Link from 'next/link'

class Forum_Index extends React.Component {
		constructor(props)
		{
				super(props);
                this.api = new ForumApi();
		}
	render() {
	return (
		<>
			FORUM INDEX!s
            <div id="uniq">
            {(this.api.getForumList().map((value,index) => {
                console.log("Newval: " + value);
                return (
                    <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                        <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={12}>
                            <Row>
                                <Link key={"/forums/topics/" + index} href={"/forums/topics/" + index}>
                                {value}
                                </Link>
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