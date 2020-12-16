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
					<Link href={"/forums/forum/" + this.props.query.slug + "/create"}>Create Topic</Link>
            </div>
		</>
	)
	}
}
export default pageLayout(Topic);