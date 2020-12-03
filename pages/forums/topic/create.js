import {Container, Row, Col, Table} from 'react-bootstrap';
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../components/pagelayout'
import Forum_Index from '../../../components/forums'

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
		<Container fluid>
            Create Topic Here!

		</Container>
		</>
	)
	}

}
export default pageLayout(TopicCreate);