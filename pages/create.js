import CreateAccountForm from '../components/createaccount'
import { Row, Col} from 'antd';
import pageLayout from '../components/pagelayout'



class CreatePage extends React.Component {
    constructor(props)
    {
        super(props);
    }
    render = () => {
        console.log('Query');
        console.log(this.props.query);
        return (
            <>
            <Row justify="space-around" align="middle">
                <Col span={4} align-items="center">
                    <CreateAccountForm></CreateAccountForm>
                </Col>
            </Row>
            </>
        )    
    }
}
export default pageLayout(CreatePage);
