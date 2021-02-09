import { Component } from "react";

import {Layout, Menu } from 'antd';
import {Link, withRouter} from "react-router-dom";

const { Header } = Layout;

const Pages = [
    {
    "path": "/",
    "title": "Home"
    },
    {
        "path": "/account",
        "title": "Account"
    }
]

class GHeader extends Component {
    render() {
        return (
            <Header>
                <Menu theme="dark" mode="horizontal" selectedKeys={[this.props.location.pathname]}>
                    <li className={"ant-menu-item ant-menu-item-only-child brand"}>G-Lytics</li>

                    {Pages.map(page => {
                        return <Menu.Item isSelected={true} key={page.path}><Link to={page.path}>{page.title}</Link></Menu.Item>
                    })}
                </Menu>
            </Header>
        )
    }
}

export default withRouter(GHeader)