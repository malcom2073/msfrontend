import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'
import { create } from 'apisauce'
import MSNavbar from '../components/navbar'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import SideNav, { Toggle, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import Link from 'next/link'

import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faHome, faCogs, faTools, faUsers } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home({allPostsData}) {
  return (
    <>
    <SideNav
    onSelect={(selected) => {
        // Add your code here
    }}
>
    <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="home">
            <NavIcon>
            <FontAwesomeIcon icon={faHome} style={{ fontSize: '1.75em' }}/>
            </NavIcon>
            <NavText>
                Home
            </NavText>
        </NavItem>
        <NavItem eventKey="config">
            <NavIcon>
            <FontAwesomeIcon icon={faTools} style={{ fontSize: '1.75em' }}/>
            </NavIcon>
            <NavText>
                Configuration
            </NavText>
            <NavItem eventKey="config/general">
                <NavText>
                    <FontAwesomeIcon icon={faCogs} style={{ fontSize: '1.25em' }}/> <Link href="#">General Config</Link>
                </NavText>
            </NavItem>
            <NavItem eventKey="config/userlist">
                <NavText>
                    <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.25em' }}/> <Link href="/users">User List</Link>
                </NavText>
            </NavItem>
        </NavItem>
        <NavItem  eventKey="charts">
            <NavIcon>
            <FontAwesomeIcon icon={faTools} style={{ fontSize: '1.75em' }}/>
            </NavIcon>
            <NavText>
                Configurations
            </NavText>
            <NavItem eventKey="charts/linechart">
                <NavText>
                    Line Chart
                </NavText>
            </NavItem>
            <NavItem eventKey="charts/barchart">
                <NavText>
                    Bar Chart
                </NavText>
            </NavItem>
        </NavItem>
    </SideNav.Nav>
</SideNav>

    <Container fluid>
      <Row>
        <Col>
          <MSNavbar/>
        </Col>
      </Row>
    </Container>
  </>
  )
}

export async function getServerSideProps(context) {
  const allPostsData = await getSortedPostsData()
  return {
    props: {
      // props for your component
      allPostsData
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
