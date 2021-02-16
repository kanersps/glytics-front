import { Component } from "react";

import {Layout, Menu} from 'antd';
import {Link, withRouter} from "react-router-dom";
import LoggedIn from "./LoggedIn";

const { Header } = Layout;

const Pages = []

class GHeader extends Component {
    render() {
        return (
            <Header style={{position: "fixed", width: "100%", zIndex: 99}}>
                <Menu theme="dark" mode="horizontal" selectedKeys={[""]}>
                    <li className={"ant-menu-item ant-menu-item-only-child brand"}><Link onClick={() => {
                        this.props.updateDashboard("Account", "/account/details")
                    }} to={this.props.loggedIn ? "/account" : "/"}><span>G-Lytics { this.props.apikey }</span></Link></li>

                    {Pages.map(page => {
                        return <Menu.Item key={page.selector}><Link to={page.path}>{page.title}</Link></Menu.Item>
                    })}


                    { !this.props.loggedIn ? null : <LoggedIn updateDashboard={this.props.updateDashboard} logout={this.props.logout} /> }

                </Menu>
            </Header>
        )
    }
}

export default withRouter(GHeader)