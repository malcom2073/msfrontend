import {Container, Row, Col, Table} from 'react-bootstrap';
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../../components/pagelayout'
import Forum_Index from '../../../../components/forums'
import CreateComment from '../../../../modules/forum/components/createcomment'
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