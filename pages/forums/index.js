import {Container, Row, Col, Table} from 'react-bootstrap';
import nextCookie from 'next-cookies'
import { render } from 'react-dom';
import pageLayout from '../../components/pagelayout'
import Forum_Index from '../../components/forums'


class Forum extends React.Component {
    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <>
                Main Forum Index
            <Container fluid>
                <Forum_Index></Forum_Index>
            </Container>
            </>
        )
    }

}
export default pageLayout(Forum);