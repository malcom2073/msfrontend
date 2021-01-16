import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import dynamic from 'next/dynamic'
//const TopicList = dynamic(import('../../../modules/forum/components/topic'), {ssr: false})
import TopicList from '../../../modules/forum/components/topic'
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
                <div id="uniq">
                    <TopicList query={this.props.query}/>
                </div>
                <div id="posttopic">
                        Post new Comment here	
                        <Link href={"/forums/topic/" + this.props.query.slug + "/create"}> Create post</Link>
                </div>
            </>
        )
    }
}
export default pageLayout(Topic);