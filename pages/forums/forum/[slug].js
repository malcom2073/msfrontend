import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import ForumList from '../../../modules/forum/components/forum'
import { withRouter } from 'next/router'
import pageLayout from '../../../components/pagelayout'
import Link from 'next/link'
class Topic extends React.Component {
		constructor({query})
		{
                super();
                //this.api = new ForumApi();
                //this.state = {loaded:false};
        }
	render() {
	return (
		<>
			Forum List!s
            <div id="uniq">
                <ForumList query={this.props.query}/>
            </div>
		</>
	)
	}
}
export default pageLayout(Topic);