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


export default function Home({allPostsData}) {
  return (
    <>
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
