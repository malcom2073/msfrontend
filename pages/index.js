import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import { create } from 'apisauce'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'


export default function Home({ allPostsData,navBar }) {
  return (
    <>
    <Container fluid>
      <Row>
        <Col>
          <Navbar bg="light" expand="sm">
            <Navbar.Brand href="#">MikesShop.net</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
              {navBar.menuleft.map((value, index) => {
                  if (value.type == "link") {
                    return <Nav.Link href={value.link}>{value.title}</Nav.Link>
                  } else if (value.type == "dropdown") {
                    return (
                      <NavDropdown title={value.title} id="basic-nav-dropdown">
                        {value.links.map((value2,index) => {
                          if (value2.type == "link") {
                            return <NavDropdown.Item href={value2.link}>{value2.title}</NavDropdown.Item>
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
                    return <Nav.Link href={value.link}>{value.title}</Nav.Link>
                  } else if (value.type == "dropdown") {
                    return (
                      <NavDropdown title={value.title} id="basic-nav-dropdown">
                        {value.links.map((value2,index) => {
                          if (value2.type == "link") {
                            return <NavDropdown.Item href={value2.link}>{value2.title}</NavDropdown.Item>
                          } else if (value2.type == "divider") {
                            return <NavDropdown.Divider />
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
        </Col>
      </Row>
    </Container>
  </>
  )
}
export async function getUserNavbar() {
  const api = create({
    baseURL: 'http://localhost:5000',
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  const response = await api.get('/getNavbar');
  console.log(response.data)
  return response.data;
}
export async function getServerSideProps(context) {
  const allPostsData = await getSortedPostsData()
  const navBar = await getUserNavbar()
  return {
    props: {
      // props for your component
      allPostsData,
      navBar
    }
  }
}

//export async function getStaticProps() {
//  const allPostsData = getSortedPostsData()
//  return {
//    props: {
//      allPostsData
//    }
//  }
//}
