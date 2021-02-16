import {Row, Col, Layout, Menu} from "antd";
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
import Title from "antd/es/typography/Title";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000
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
                path: "/applications/websites",
                name: "Websites"
            }
        ]
    }
]

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openSelection: {},
            activeMenus: [this.getActiveCategory()]
        }

        this.menuRef = null;

        this.setMenuRef = element => {
            this.menuRef = element;
        }
    }

    capitalizeFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getActiveCategory() {
        for(let category of categories) {
            for(let item of category.items) {
                if(item.path === window.location.pathname)
                    return category.name;
            }
        }

        if(window.location.pathname.split("/").length > 1) {
            return this.capitalizeFirstLetter(window.location.pathname.split("/")[1]);
        }

        return "Account";
    }

    getActivePage() {
        if(window.location.pathname.split("/").length > 1) {
            if(window.location.pathname.split("/")[2] === "website")
                return "/applications/websites";
        }

        return window.location.pathname === "/account" ? "/account/details" : window.location.pathname;
    }

    checkApiKey(prevProps, force) {
        if(force || this.props.apikey !== prevProps.apikey) {
            api.defaults.headers = {
                "key": this.props.apikey
            }

            api.get("account/authenticated")
                .then(res => {
                    if(!res.data.success) {
                        localStorage.clear();
                        window.location.href = "/account/login"
                    } else {
                        this.props.loggedIn();
                    }
                })
                .catch(_ => {
                    localStorage.clear();
                    window.location.href = "/account/login"
                })
        }
    }

    onMenuOpenChange(menus) {
        this.setState({
            activeMenus: menus
        })
    }

    componentDidMount() {
        this.checkApiKey(null, true)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkApiKey(prevProps);

        if(prevProps.update !== this.props.update) {
            if(!this.props.updateDashboardTo) {
                this.setState({
                    openSelection: {
                        openKeys: [...this.state.activeMenus, "Applications"],
                        selectedKeys: ["/applications/websites"],
                    }
                }, () => {
                    this.setState({
                        openSelection: {}
                    })
                })
            } else {
                console.log(this.props.updateDashboardToCategory)
                console.log(this.props.updateDashboardTo)

                this.setState({
                    openSelection: {
                        openKeys: [...this.state.activeMenus, this.props.updateDashboardToCategory],
                        selectedKeys: [this.props.updateDashboardTo],
                    }
                }, () => {
                    this.setState({
                        openSelection: {}
                    })
                })
            }
        }
    }

    render() {
        return <Layout>
            <Sider width={200} className="site-layout-background" style={{position: "fixed", bottom: 40, top: 80}}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[this.getActivePage()]}
                    defaultOpenKeys={[this.getActiveCategory()]}
                    style={{ height: '100%', borderRight: 0 }}
                    onOpenChange={(v) => {
                        this.onMenuOpenChange(v)
                    }}
                    ref={this.setMenuRef}
                    {...this.state.openSelection}
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

            <Layout style={{ padding: '0 24px 24px', marginLeft: 200 }}>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Row>
                        <Col span={24}>
                            <BreadcrumbPath style={{ margin: '16px 0' }} />&nbsp;
                        </Col>
                    </Row>

                    <Switch>
                        <Route path={"/account/details"}>
                            <AccountDetails apikey={this.props.apikey} />
                        </Route>

                        <Route path={"/account/privacy"}>
                            <Title>WIP</Title>
                        </Route>

                        <Route path={"/applications"}>
                            <Applications apikey={this.props.apikey}/>
                        </Route>

                        <Route path={"/account"}>
                            <Redirect to={"/account/details"}/>
                        </Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    }
}

export default Dashboard