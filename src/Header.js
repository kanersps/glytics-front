import { Component } from "react";

import {Dropdown, Layout, Menu} from 'antd';
import {Link, withRouter} from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";

const { Header } = Layout;

const Pages = [
    {
        "path": "/account",
        "selector": "account",
        "title": "Account"
    }
]

class GHeader extends Component {

    render() {
        const menu = (
            <Menu style={{width: 200}}>
                <Menu.Item danger onClick={this.props.logout}>Logout</Menu.Item>
            </Menu>
        );
        return (
            <Header>
                <Menu theme="dark" mode="horizontal" selectedKeys={[""]}>
                    <li className={"ant-menu-item ant-menu-item-only-child brand"}><Link to={"/"}><span>G-Lytics</span></Link></li>

                    {Pages.map(page => {
                        return <Menu.Item key={page.selector}><Link to={page.path}>{page.title}</Link></Menu.Item>
                    })}


                    { !this.props.loggedIn ? null : <Dropdown overlay={menu}>
                        <li className={"ant-menu-item ant-menu-item-only-child"} style={{float: "right"}}>
                                <div>
                                    <Avatar size={32} icon={<UserOutlined />} />
                                </div>
                        </li>
                    </Dropdown> }

                </Menu>
            </Header>
        )
    }
}

export default withRouter(GHeader)