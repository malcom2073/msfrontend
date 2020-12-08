import {Container, Row, Col, Table} from 'react-bootstrap';
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../components/pagelayout'
import Forum_Index from '../../../components/forums'
import CreateTopic from '../../../modules/forum/components/createtopic'

class TopicCreate extends React.Component {
		constructor(props)
		{
				super(props);
				this.state = props;
		}
	render() {
	return (
		<>
			Main Forum Index
			Create Topic Here! ID: {this.props.query.forum}
		<Container fluid>
			<CreateTopic query={this.props.query}/>

		</Container>
		</>
	)
	}

}
export default pageLayout(TopicCreate);