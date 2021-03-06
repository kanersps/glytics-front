import {Component} from "react";

import {Layout, Menu} from 'antd';
import {Link, withRouter} from "react-router-dom";
import LoggedIn from "./LoggedIn";
import {BulbFilled, BulbOutlined} from "@ant-design/icons";

const {Header} = Layout;

const Pages = []

class GHeader extends Component {
    render() {
        return (
            <Header style={{position: "fixed", width: "100%", zIndex: 3, background: "#141414"}}>
                <Menu style={{background: "#141414"}} theme="dark" mode="horizontal" selectedKeys={[""]}>
                    <li style={{background: "#141414", padding: 0, paddingLeft: 15}}
                        className={"ant-menu-item ant-menu-item-only-child brand"}><Link
                        onClick={() => {
                            this.props.updateDashboard("Account", "/account/details")
                        }} to={this.props.loggedIn ? "/account" : "/"}><span>G-Lytics {this.props.apikey}</span></Link>
                    </li>

                    {Pages.map(page => {
                        return <Menu.Item key={page.selector}><Link to={page.path}>{page.title}</Link></Menu.Item>
                    })}

                    <span className={"darkmode-toggle"} onClick={this.props.toggleDarkMode}
                          style={{float: "right", fontSize: "20px"}}>
                        {this.props.darkmode ? <BulbOutlined/> : <BulbFilled/>}
                    </span>

                    {!this.props.loggedIn ? null :
                        <LoggedIn name={this.props.accountName} darkmode={this.props.darkmode}
                                  updateDashboard={this.props.updateDashboard} logout={this.props.logout}/>}

                </Menu>
            </Header>
        )
    }
}

export default withRouter(GHeader)
