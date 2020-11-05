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
import { UserOutlined, LaptopOutlined, NotificationOutlined,SettingOutlined } from '@ant-design/icons';
import Link from 'next/link'
import MsApi from '../lib/msapi'
import { AuthToken } from "../services/auth_token";
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
                <Menu style={{float: 'left'}} theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                {(this.state && !this.state.isLoading) ? (this.state.navBar.menuleft.map((value, index) => {
                            if (value.type == "link") {
                                console.log(value.title);
                                return (
                                    <Menu.Item key={value.title}>
                                        <Link key={value.title+"link"} href={value.link} passHref>
                                            <Nav.Link href={value.link}>{value.title}</Nav.Link>
                                        </Link>
                                    </Menu.Item>
                                )
                            } else if (value.type == "dropdown") {
                                console.log("Dropdown: " + value.title);
                            return (
                                <SubMenu key={value.title} icon={<SettingOutlined />} title={value.title}>
                                {value.links.map((value2,index2) => {
                                    if (value2.type == "link") {
                                        console.log(value.title + value2.title);
                                    return (
                                        <Menu.Item key={value.title + value2.title}>
                                        <Link key={value.title + value2.title+"link"} href={value2.link} passHref>
                                            <Nav.Link href={value2.link}>{value2.title}</Nav.Link>
                                        </Link>
                                        </Menu.Item>
                                        )
                                    } else if (value2.type == "divider") {
                                    return <></>
                                    }
                                })}                                    
                                </SubMenu>
                            )
                            }
                        })
                        ) : (
                            <></>
                        )}
                </Menu>
                <Menu style={{float: 'right'}} theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                {(this.state && !this.state.isLoading) ? (this.state.navBar.menuright.map((value, index) => {
                            if (value.type == "link") {
                                console.log(value.title);
                                return (
                                    <Menu.Item key={value.title}>
                                        <Link key={value.title+"link"} href={value.link} passHref>
                                            <Nav.Link href={value.link}>{value.title}</Nav.Link>
                                        </Link>
                                    </Menu.Item>
                                )
                            } else if (value.type == "dropdown") {
                                console.log("Dropdown: " + value.title);
                            return (
                                <SubMenu key={value.title} icon={<SettingOutlined />} title={value.title}>
                                {value.links.map((value2,index2) => {
                                    if (value2.type == "link") {
                                        console.log(value.title + value2.title);
                                    return (
                                        <Menu.Item key={value.title + value2.title}>
                                        <Link key={value.title + value2.title+"link"} href={value2.link} passHref>
                                            <Nav.Link href={value2.link}>{value2.title}</Nav.Link>
                                        </Link>
                                        </Menu.Item>
                                        )
                                    } else if (value2.type == "divider") {
                                    return <></>
                                    }
                                })}                                    
                                </SubMenu>
                            )
                            }
                        })
                        ) : (
                            <></>
                        )}
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
        async componentDidMount() {
            var msapi = new MsApi();
            const navBar = await msapi.getUserNavbar(null);
            this.setState({navBar:navBar,isLoading: false,auth: AuthToken.fromNext(null)});
            //var profileobj = await msapi.getUserList();
            //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
            //this.setState({ isLoading: false,auth: new AuthToken(this.props.auth.token) ,profile:profileobj })
        }
    }
    
}
