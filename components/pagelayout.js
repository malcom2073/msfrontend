import React from 'react';
import Head from 'next/head'
//import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Component from 'react'
//import Date from '../components/date'
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
        render = () => {
            console.log("pageLayout::render");
            console.log(this.props);
            return (
                <>
                <Head>
                    {(this.props && this.props.meta && this.props.meta.title) ? (
                        <title>{this.props?.meta?.title}</title>
                    ) : (
                        <title>Mikesshop.net</title>
                    )}
                    {(process.env.NODE_ENV == 'production') ? (
                        <script async defer data-website-id={process.env.TR_WEBSITE_ID} src={process.env.TR_WEBSITE_SCRIPT} />
                    ) : (
                        <></>
                    )}
                    {(this.props && this.props.meta && this.props.meta.description) ? (
                        <meta name="description" content={this.props?.meta?.description} />
                    ) : (
                        <></>
                    )}
                    {(this.props && this.props.meta && this.props.meta.keywords) ? (
                        <meta name="keywords" content={this.props?.meta?.keywords} />
                    ) : (
                        <></>
                    )}
                </Head>
                <Layout>
                    <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <MSNavBar/>
                    </Header>
                    
                    <Layout style={{ padding: '0 0', marginTop: 64 }}>
                    {/*<MSAdminSideBar/>*/}
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        {(this.props && this.props.pathname) ? (this.props.pathname.substring(1).split("/").map((value,index) => {
                            if (value != "")
                            {
                                var pathname = this.props.pathname.substring(1);
                                var textval = value;
                                var urlval = value;
                                if (value == "[slug]")
                                {
                                    if (this.props.query && this.props.title)
                                    {
//                                        textval = this.props.query.slug;
                                        textval = this.props.title;
                                        urlval = this.props.query.slug;
                                    }
                                }
                                var path = pathname.split("/").slice(0,index).join("/") + "/" + urlval;
                                console.log("PATH*****");
                                console.log(path);
                                console.log(pathname);
                                console.log(index);
                                console.log(value);
                                console.log("QUERY***");
                                console.log(this.props);
                        return (

                                <Breadcrumb.Item key={"bc-" + index}>
                                    <Link key={path} href={path}>{textval}</Link>
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
                        <WrappedComponent {...this.props} auth={(this.state ? this.state.auth : null)} />
                        </Content>
                    </Layout>
                    </Layout>
                </Layout>
                </>
            )
        }
        checkAuth = () => {
            const token = AuthToken.fromNext();
            var currdate = new Date();
            var tokendate = new Date(token.decodedToken.exp * 1000)
            if (token &&  currdate > tokendate) {
                //Router.push('/login?next=' + this.state.pathname);
            }
            else {
                if (token) {
                    // if it's within 60 seconds of expiring, request a new one 
                    tokendate.setSeconds(tokendate.getSeconds() - 60);
                    if (currdate > tokendate) {
                        // Token is not yet expired, but is within 1 minute of expiring. Refresh it.
                        var api = new MsApi();
                        api.refreshToken();
                    }
                }
                else {
                    // TODO: Refresh the page since we're logged out?
                    //Router.push('/login?next=' + this.state.pathname);
                    Router.push(this.state.pathname);
                }
            }
        }
        static getInitialProps = async(ctx) => {
            if (WrappedComponent.getInitialProps) {
              const wrappedProps = await WrappedComponent.getInitialProps(ctx);
              return { ...wrappedProps, query:ctx.query,pathname:ctx.pathname };
            }
            return {query:ctx.query,pathname:ctx.pathname};
        }
        componentWillUnmount = () => {
            clearInterval(this.apichecktimer);
        }
        componentDidMount = async () => {
            var msapi = new MsApi();
            const navBar = await msapi.getUserNavbar(null);
            this.setState({navBar:navBar,isLoading: false,auth: AuthToken.fromNext(null)});
            this.apichecktimer = setInterval(function() { this.checkAuth(); }.bind(this),30000); //Check every 30 seconds
            //var profileobj = await msapi.getUserList();
            //This is required to turn auth into an actual AuthToken instance, for passing into the component below.
            //this.setState({ isLoading: false,auth: new AuthToken(this.props.auth.token) ,profile:profileobj })
        }
    }    
}