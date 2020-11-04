import SideNav, { Toggle, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faHome, faCogs, faTools, faUsers } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class MSAdminSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true};
    }
    render() {
return (
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
)
    }
}
export default MSAdminSideBar;