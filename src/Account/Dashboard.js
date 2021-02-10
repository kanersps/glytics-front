import {Button, Row, Col, Layout, Menu} from "antd";
import {HomeOutlined, UserOutlined} from "@ant-design/icons";
import BreadcrumbPath from "../BreadcrumbPath";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import * as React from "react";
import Sider from "antd/es/layout/Sider";
import SubMenu from "antd/es/menu/SubMenu";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import Applications from "./Applications"
import AccountDetails from "./AccountDetails";

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 2000
});

const categories = [
    {
        name: "Account",
        icon: <UserOutlined />,
        items: [
            {
                path: "/account/details",
                name: "Details"
            },
            {
                path: "/account/privacy",
                name: "Privacy"
            }
        ]
    },
    {
        name: "Applications",
        icon: <HomeOutlined />,
        items: [
            {
                path: "/account/applications/websites",
                name: "Websites"
            }
        ]
    }
]

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    getActiveCategory() {
        for(let category of categories) {
            for(let item of category.items) {
                if(item.path === window.location.pathname)
                    return category.name;
            }
        }

        return "Account";
    }

    checkApiKey(prevProps, force) {
        if(force || this.props.apikey !== prevProps.apikey) {
            api.defaults.headers = {
                "key": this.props.apikey
            }

            api.get("account/authenticated")
                .then(res => {
                    if(!res.data.success) {
                        window.location.href = "/account/login"
                    }
                })
                .catch(e => {
                    window.location.href = "/account/login"
                })
        }
    }

    componentDidMount() {
        this.checkApiKey(null, true)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkApiKey(prevProps);
    }

    render() {
        return <Layout>
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[window.location.pathname === "/account" ? "/account/details" : window.location.pathname]}
                    defaultOpenKeys={[this.getActiveCategory()]}
                    style={{ height: '100%', borderRight: 0 }}
                >

                    { categories.map(category => {
                        return <SubMenu key={category.name} icon={category.icon} title={category.name}>
                            { category.items.map(item => {
                                return <Menu.Item key={item.path}>
                                    <Link to={item.path}>{ item.name }</Link>
                                </Menu.Item>
                            })}
                        </SubMenu>
                    }) }
                </Menu>
            </Sider>

            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Row>
                        <Col span={20}>
                            <BreadcrumbPath style={{ margin: '16px 0' }} />&nbsp;
                        </Col>
                        <Col span={4}>
                            <Button onClick={this.props.logout}>Logout</Button>
                        </Col>
                    </Row>

                    <Switch>
                        <Route path={"/account/details"}>
                            <AccountDetails apikey={this.props.apikey} />
                        </Route>

                        <Route path={"/account/privacy"}>
                        </Route>

                        <Route path={"/account/applications"}>
                            <Applications></Applications>
                        </Route>

                        <Route path={"/account"}>
                            <Redirect to={"/account/details"}></Redirect>
                        </Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    }
}

export default Dashboard