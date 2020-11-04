import MSNavbar from '../components/navbar'
import LoginForm from '../components/loginform'
import { Space, Row, Col} from 'antd';


export default function Login({query}) {
    console.log('Query');
    console.log(query);
    return (
    <>
    <Row justify="space-around" align="middle">
        <Col span={4} align-items="center">
            <LoginForm next={query.next}></LoginForm>
        </Col>
    </Row>
    </>
    )
}
export async function getServerSideProps(ctx) {
    var query = ctx.query;
    return {
        props: {
            // props for your component
            query
        }
    }
}
  