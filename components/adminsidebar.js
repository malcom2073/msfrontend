import React from 'react';
import SideNav, { Toggle, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faHome, faCogs, faTools, faUsers } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { UserOutlined, LaptopOutlined, NotificationOutlined, SettingFilled, DashboardOutlined, DatabaseOutlined} from '@ant-design/icons';
import { ApiOutlined, MessageOutlined, TeamOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Layout, Menu, Breadcrumb  } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
class MSAdminSideBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render = () => {
        return (
        <>
        <Sider width={200} className="site-layout-background">
            <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
                >
                <Menu.Item key="13" icon={<DashboardOutlined/>}>Dashboard</Menu.Item>
                <SubMenu key="sub1" icon={<DatabaseOutlined />} title="Configuration">
                    <Menu.Item key="1" icon={<SettingFilled />}>General settings</Menu.Item>
                    <Menu.Item key="2" icon={<ApiOutlined/>}>API</Menu.Item>
                    <Menu.Item key="3" icon={<MessageOutlined/>}>Messaging</Menu.Item>
                    <Menu.Item key="4" icon={<TeamOutlined/>}>Users</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                    <Menu.Item key="5">option5</Menu.Item>
                    <Menu.Item key="6">option6</Menu.Item>
                    <Menu.Item key="7">option7</Menu.Item>
                    <Menu.Item key="8">option8</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                    <Menu.Item key="9">option9</Menu.Item>
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
        </>
        )
    }
}
export default MSAdminSideBar;