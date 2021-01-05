import {Container, Row, Col, Table} from 'react-bootstrap';
import MSNavbar from '../../components/navbar'
import Link from 'next/link'
import {getUserNavbar} from '../../components/navbar'
import LoginForm from '../../components/loginform'
import nextCookie from 'next-cookies'
import privateRoute from "../../components/privateroute";
import { render } from 'react-dom';
import { AuthToken } from "../../services/auth_token";
import MsApi from '../../lib/msapi';
import pageLayout from '../../components/pagelayout'

class Users extends React.Component {
    constructor(props)
    {
        super(props);
        //this.state = props;
        this.state = {...props,isLoading: true};

    }
    render() {
        console.log(this.props);
        return (
            <>

            <Table striped bordered hover>
            <tbody>
            {(this.state && !this.state.isLoading) ? (this.state.profile.map((value, index) => {
                return (
                    <tr>
                        <td>{value.name}</td>
                        <td>{value.email}</td>
                        <td>{value.timezone}</td>
                        <td>{value.lastip}</td>
                        <td>{value.primary_group.name}</td>
                        <td>{value.registered_date}</td>
                        <td><Link href={"/users/edit/" + value.id}>Edit</Link></td>
                    </tr>
                )
            })
            ) : (
                <></>
            )}
            </tbody>
            </Table>
        </>
        )
    }
    async componentDidMount() {
        var msapi = new MsApi();
        var profileobj = await msapi.getUserList();
        //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
        this.setState({ isLoading: false,auth: new AuthToken(this.props.auth.token) ,profile:profileobj })
    }
    static async getInitialProps(ctx) {
        //return ctx;
        //const navBar = await getUserNavbar(ctx)
        //this.setState({navBar:navBar});
        //return { navBar: navBar }
        //  return {}
    }
}

export default privateRoute(pageLayout(Users));