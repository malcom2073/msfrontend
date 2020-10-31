import { create } from 'apisauce'
import {Row, Col} from 'react-bootstrap';
import Link from 'next/link'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { AuthToken } from "../services/auth_token";


class MSNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true};
    }

    // Ensure we grab the navbar upon loading from the backend
    componentDidMount = async () => {
        const navBar = await MSNavBar.getUserNavbar(null);
        this.setState({navBar:navBar,isLoading: false,auth: AuthToken.fromNext(null)});
    }

    static getUserNavbar = async (ctx) => {
        console.log(ctx);
        var token = ''
        // This can be run from server or client. Server grabs the auth token from serverside storage,
        // the browser grabs it from a cookie.
        if (ctx && 'req' in ctx) {
            console.log('CTX in server is valid!');
            token = AuthToken.fromNext(ctx.req)
        }
        else
        {
            token = AuthToken.fromNext(null)     
        }
        
        // Call into our API, with the token
        // TODO: Wrap the apisauce stuff into a class
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        const api = create({
            baseURL: 'http://localhost:3000',
            headers: headers,
        })
        const response = await api.get('/api/getNavbar');
        switch (response.problem) {
            case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    //TODO: Handle this, it should never happen, but other errors may?
                    console.log('Bad Auth');
                    return {}
                    //Bad authentication!
                }
                break;
            default:
                break;
        }
        return response.data;
    }
    render() {
        // Navbar has two link groups, left and right.
        // Left is usually used for common links: Home, Status, Forums, etc
        // Right would be used for a user dropdown, or settings menu
        return (
            <Navbar bg="light" expand="sm">
                <Navbar.Brand href="#">MikesShop.net</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {(this.state && !this.state.isLoading) ? (this.state.navBar.menuleft.map((value, index) => {
                            if (value.type == "link") {
                                return (
                                    <Link key={value.title} href={value.link} passHref>
                                        <Nav.Link href={value.link}>{value.title}</Nav.Link>
                                    </Link>
                                )
                            } else if (value.type == "dropdown") {
                            return (
                                <NavDropdown title={value.title} id="basic-nav-dropdown">
                                {value.links.map((value2,index) => {
                                    if (value2.type == "link") {
                                    return (
                                        <Link key={value2.title} href={value2.link} passHref>
                                            <NavDropdown.Item href={value2.link}>{value2.title}</NavDropdown.Item>
                                        </Link>
                                        )
                                    } else if (value2.type == "divider") {
                                    return <NavDropdown.Divider />
                                    }
                                })}
                                </NavDropdown>
                            )
                            }
                        })
                        ) : (
                            <></>
                        )}
                    </Nav>
                    Expires: { this.state  && this.state.auth ? (this.state.auth.expiresAt() - new Date()).toString() : <></>}
                    <Nav className="justify-content-end">
                        { (this.state && !this.state.isLoading) ? (this.state.navBar.menuright.map((value, index) => {
                            if (value.type == "link") {
                            return (
                                <Link key={value.title} href={value.link} passHref>
                                    <Nav.Link href={value.link}>{value.title}</Nav.Link>
                                </Link>  
                                )
                            } else if (value.type == "dropdown") {
                            return (
                                <NavDropdown key={value.title} title={value.title} id="basic-nav-dropdown">
                                {value.links.map((value2,index) => {
                                    if (value2.type == "link") {
                                    return (
                                        <Link key={value2.title} href={value2.link} passHref>
                                            <NavDropdown.Item href={value2.link}>{value2.title}</NavDropdown.Item>
                                        </Link>
                                    )
                                    } else if (value2.type == "divider") {
                                    return <NavDropdown.Divider key={value.title} />
                                    }
                                })}
                                </NavDropdown>
                            )
                            }
                        })
                        ) : (
                            <></>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default MSNavBar;