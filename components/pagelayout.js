import Head from 'next/head'
//import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Component from 'react'
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
import MSAdminSideBar from '../components/adminsidebar'
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Link from 'next/link'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function pageLayout(WrappedComponent) {
    return class extends React.Component {
        render() {
            return (
        <>
        <Layout>
            <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div style={{height: '32px', width: '120px', background: '#ffffff' ,margin: '2px', float: 'left'}} className="logo"/>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">
                        <Link key="Home" href="/" passHref>
                            <Nav.Link href="/">Home</Nav.Link>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link key="Users" href="/users" passHref>
                                <Nav.Link href="/users">Users</Nav.Link>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link key="Profile" href="/profile" passHref>
                                <Nav.Link href="/profile">Profile</Nav.Link>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Header>
            
            <Layout style={{ padding: '0 0', marginTop: 64 }}>
            <MSAdminSideBar/>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
                >
                <WrappedComponent {...this.props} />;
                </Content>
            </Layout>
            </Layout>
        </Layout>
        </>)
        }
    }
}
