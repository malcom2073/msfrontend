import MSNavbar from '../components/navbar'
import CreateAccountForm from '../components/createaccount'
import { Space, Row, Col} from 'antd';


export default function Login({query}) {
    console.log('Query');
    console.log(query);
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
export async function getInitialProps({server,pathname,query,req,res}) {
    return {
        props: {
            // props for your component
            query
        }
    }
}
  