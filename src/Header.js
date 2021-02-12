import { Component } from "react";

import {Layout, Menu } from 'antd';
import {Link, withRouter} from "react-router-dom";

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
        return (
            <Header>
                <Menu theme="dark" mode="horizontal" selectedKeys={[""]}>
                    <li className={"ant-menu-item ant-menu-item-only-child brand"}><Link to={"/"}><span>G-Lytics</span></Link></li>

                    {Pages.map(page => {
                        return <Menu.Item key={page.selector}><Link to={page.path}>{page.title}</Link></Menu.Item>
                    })}
                </Menu>
            </Header>
        )
    }
}

export default withRouter(GHeader)