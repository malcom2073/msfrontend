import Head from 'next/head'
//import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Component from 'react'
import Date from '../components/date'
import { create } from 'apisauce'
import MSNavBar from '../components/navbar'
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
            console.log("pageLayout::render");
            console.log(this.props);
            return (
        <>
        <Layout>
            <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <MSNavBar/>
            </Header>
            
            <Layout style={{ padding: '0 0', marginTop: 64 }}>
            <MSAdminSideBar/>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                {(this.props && this.props.pathname) ? (this.props.pathname.split("/").map((value,index) => {
                    if (value != "")
                    {
                        var pathname = this.props.pathname;
                        var path = pathname.split("/").slice(1,index).join("/") + "/" + value;
                        console.log("*****");
                        console.log(pathname);
                        console.log(path);
                        console.log(value);
                return (

                        <Breadcrumb.Item href={path}>
                            <Link key={path} href={path}>{value}</Link>
                        </Breadcrumb.Item>)
                    }
                })) : (<></>)}
                </Breadcrumb>
                <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
                >
                <WrappedComponent {...this.props} />
                </Content>
            </Layout>
            </Layout>
        </Layout>
        </>)
        }

          
        static async getInitialProps({query,pathname}) {
            console.log("PageLayoutProps");
            console.log(query);
            console.log(pathname);
            return {query:query,pathname:pathname}
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