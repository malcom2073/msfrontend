import { create } from 'apisauce'
import {Row, Col} from 'react-bootstrap';
import Link from 'next/link'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'


export default function MsNavbar({navBar}) {
    return (
        <Navbar bg="light" expand="sm">
            <Navbar.Brand href="#">MikesShop.net</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                {navBar.menuleft.map((value, index) => {
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
                })}
                </Nav>
                <Nav className="justify-content-end">
                {navBar.menuright.map((value, index) => {
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
                })}
                </Nav>
                {
                //<Form inline>
                //<FormControl type="text" placeholder="Search" className="mr-sm-2" />
                //<Button variant="outline-success">Search</Button>
                //</Form>
                }
            </Navbar.Collapse>
        </Navbar>
    )
}
export async function getUserNavbar() {
    const api = create({
      baseURL: 'http://localhost:3000',
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    const response = await api.get('/api/getNavbar');
    switch (response.problem) {
      case 'CLIENT_ERROR':
        if (response.status == 401)
        {
          return {}
          //Bad authentication!
        }
        break;
      default:
          break;
    }
    return response.data;
  }
  