import {Container, Row, Col, Table} from 'react-bootstrap';
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../../components/pagelayout'
import Forum_Index from '../../../components/forums'
import CreateTopic from '../../../modules/forum/components/createtopic'
import privateRoute from "../../../components/privateroute";
class CommentCreate2 extends React.Component {
    constructor(props)
    {
        super(props);
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
export default privateRoute(pageLayout(CommentCreate2));