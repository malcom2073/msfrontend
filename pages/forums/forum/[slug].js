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
        }
	render() {
	return (
		<>
			Forum Slug Page
            <div id="uniq">
                <ForumList query={this.props.query}/>
            </div>
			<div id="posttopic">
                    Post new topic here	
					<Link href={"/forums/topic/create?forum="+ this.props.query.slug}>Create Topic</Link>
            </div>
		</>
	)
	}
}
export default pageLayout(Topic);