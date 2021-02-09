import {UserOutlined} from "@ant-design/icons";
import BreadcrumbPath from "../BreadcrumbPath";
import * as React from "react";

import { Layout, Menu } from 'antd';

import {useMediaQuery} from "react-responsive";
import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}

const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Account extends React.Component {
    render() {
        return <Layout style={{ marginTop: 20 }}>

            <Switch>
                <Route path={"/account/login"}>
                    <Login />
                </Route>

                <Route path={"/account/register"}>
                    <Register />
                </Route>

                <Route path={"/account"}>
                    <Redirect to={"/account/login"}></Redirect>

                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                                <Menu.Item key="1">option1</Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <BreadcrumbPath style={{ margin: '16px 0' }} />
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            Content
                        </Content>
                    </Layout>
                </Route>
            </Switch>
        </Layout>
    }
}

export default Account