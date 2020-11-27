import {Container, Row, Col, Table} from 'react-bootstrap';
import MSNavbar from '../../../components/navbar'
import {getUserNavbar} from '../../../components/navbar'
import LoginForm from '../../../components/loginform'
import nextCookie from 'next-cookies'
import { privateRoute } from "../../../components/privateroute";
import { render } from 'react-dom';
import { AuthToken } from "../../../services/auth_token";
import MsApi from '../../../lib/msapi';
import pageLayout from '../../../components/pagelayout'

class EditUser extends React.Component {
    constructor()
    {
        super();
        //this.state = props;
        this.state = {isLoading: true};

    }
    render() {
        console.log(this.props);
        return (
            <>
            Editing user {this.props.query.slug}
        </>
        )
    }
    async componentDidMount() {
        var msapi = new MsApi();
        userobj = msapi.getUser(this.props.query.slug)
        this.setState({isLoading: false, userobj: userobj})

        //var profileobj = await msapi.getUserList();
        //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
        //this.setState({ isLoading: false,auth: new AuthToken(this.props.auth.token) ,profile:profileobj })
    }
}

export default privateRoute(pageLayout(EditUser));