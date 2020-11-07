import { create } from 'apisauce'
import {Row, Col} from 'react-bootstrap';
import Link from 'next/link'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { AuthToken } from "../services/auth_token";
import { Layout, Menu, Breadcrumb } from 'antd';
import MsApi from '../lib/msapi'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { UserOutlined, LaptopOutlined, NotificationOutlined,SettingOutlined } from '@ant-design/icons';


class MSNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true};
    }

    // Ensure we grab the navbar upon loading from the backend
    componentDidMount = async () => {
        var msapi = new MsApi();
        const navBar = await msapi.getUserNavbar(null);
        this.setState({navBar:navBar,isLoading: false,auth: AuthToken.fromNext(null)});
    }

    render() {
        // Navbar has two link groups, left and right.
        // Left is usually used for common links: Home, Status, Forums, etc
        // Right would be used for a user dropdown, or settings menu
        return (
            <>
            <div style={{height: '32px', width: '120px', background: '#ffffff' ,margin: '2px', float: 'left'}} className="logo"/>
            <Menu style={{float: 'left'}} theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            {(this.state && !this.state.isLoading) ? (this.state.navBar.menuleft.map((value, index) => {
                if (value.type == "link") {
                    return (
                        <Menu.Item key={"left"+value.title}>
                            <Link key={"left"+value.title+"link"} href={value.link} passHref>
                                <Nav.Link href={value.link}>{value.title}</Nav.Link>
                            </Link>
                        </Menu.Item>
                    )
                } else if (value.type == "dropdown") {
                return (
                    <SubMenu key={"left"+value.title+"submenu"} icon={<SettingOutlined />} title={value.title}>
                    {value.links.map((value2,index2) => {
                        if (value2.type == "link") {
                        return (
                            <Menu.Item key={"left"+value.title + value2.title}>
                                <Link key={"left"+value.title + value2.title+"link"} href={value2.link} passHref>
                                    <Nav.Link href={value2.link}>{value2.title}</Nav.Link>
                                </Link>
                            </Menu.Item>
                            )
                        } else if (value2.type == "divider") {
                        //return <></>
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
                    return (
                        <Menu.Item key={"right"+value.title}>
                            <Link key={"right"+value.title+"link"} href={value.link} passHref>
                                <Nav.Link href={value.link}>{value.title}</Nav.Link>
                            </Link>
                        </Menu.Item>
                    )
                } else if (value.type == "dropdown") {
                return (
                    <SubMenu key={"right"+value.title+"submenu"} icon={<SettingOutlined />} title={value.title}>
                    {value.links.map((value2,index2) => {
                        if (value2.type == "link") {
                        return (
                            <Menu.Item key={"right"+value.title + value2.title}>
                                <Link key={"right"+value.title + value2.title+"link"} href={value2.link} passHref>
                                    <Nav.Link href={value2.link}>{value2.title}</Nav.Link>
                                </Link>
                            </Menu.Item>
                            )
                        } else if (value2.type == "divider") {
                        //return <></>
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
            </>
        )
    }
}

export default MSNavBar;