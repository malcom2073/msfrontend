import {Container, Row, Col, Table} from 'react-bootstrap';
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../../components/pagelayout'
import Forum_Index from '../../../../components/forums'
import dynamic from 'next/dynamic'
//import CreateComment from '../../../../modules/forum/components/createcomment'
const CreateComment = dynamic(import('../../../../modules/forum/components/createcomment'), {ssr: false})

import { privateRoute } from "../../../../components/privateroute";
class CommentCreate extends React.Component {
		constructor(props)
		{
				super(props);
				this.state = props;
		}
	render() {
	return (
		<>
			Main Thread Index
			Create Comment Here! ID: {this.props.query.forum}
		<Container fluid>
			<CreateComment query={this.props.query}/>

		</Container>
		</>
	)
	}

}
export default privateRoute(pageLayout(CommentCreate));