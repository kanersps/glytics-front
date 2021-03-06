import {Row, Col, Layout, Menu, Skeleton} from "antd";
import {HomeOutlined, MenuOutlined, UserOutlined} from "@ant-design/icons";
import BreadcrumbPath from "../BreadcrumbPath";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import * as React from "react";
import Sider from "antd/es/layout/Sider";
import SubMenu from "antd/es/menu/SubMenu";
import {Content, Footer} from "antd/es/layout/layout";
import axios from "axios";
import Title from "antd/es/typography/Title";
import {Suspense} from "react";

const Applications = React.lazy(() => import("./Applications"))
const AccountDetails = React.lazy(() => import("./AccountDetails"))

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000
});

const categories = [
    {
        name: "Account",
        icon: <UserOutlined/>,
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
        icon: <HomeOutlined/>,
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
            activeMenus: [this.getActiveCategory()],
            sideCollapsed: window.innerWidth < 992,
            onMobile: window.innerWidth < 992
        }

        this.menuRef = null;

        this.setMenuRef = element => {
            this.menuRef = element;
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getActiveCategory() {
        for (let category of categories) {
            for (let item of category.items) {
                if (item.path === window.location.pathname)
                    return category.name;
            }
        }

        if (window.location.pathname.split("/").length > 1) {
            return this.capitalizeFirstLetter(window.location.pathname.split("/")[1]);
        }

        return "Account";
    }

    getActivePage() {
        if (window.location.pathname.split("/").length > 1) {
            if (window.location.pathname.split("/")[2] === "website")
                return "/applications/websites";
        }

        return window.location.pathname === "/account" ? "/account/details" : window.location.pathname;
    }

    checkApiKey(prevProps, force) {
        if (force || this.props.apikey !== prevProps.apikey) {
            api.defaults.headers = {
                "Authorization": this.props.apikey
            }

            api.get("account/authenticated")
                .then(res => {
                    if (!res.data.success) {
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

        api.get("account")
            .then(res => {
                this.props.setAccountName(res.data.username);
            })

        window.addEventListener('resize', () => {
            this.updateDimensions();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkApiKey(prevProps);

        if (prevProps.update !== this.props.update) {
            if (!this.props.updateDashboardTo) {
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

    onCollapse = collapsed => {
        this.setState({sideCollapsed: collapsed});
    };

    updateDimensions() {
        if (window.innerWidth <= 992) {
            this.setState({sideCollapsed: true, onMobile: true});
        } else {
            this.setState({sideCollapsed: false, onMobile: false});
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => {
            this.updateDimensions();
        });
    }

    clickedOutSideMenu() {
        if (this.state.onMobile) {
            this.onCollapse(true);
        }
    }

    render() {
        return <Layout style={{
            background: this.props.darkmode ? "#222222" : null,
            color: this.props.darkmode ? "white" : "black"
        }}>
            <Sider collapsible collapsed={this.state.sideCollapsed} width={this.state.onMobile ? "80%" : 200}
                   onCollapse={this.onCollapse}
                   className="site-layout-background sider-menu"
                   style={{position: "fixed", bottom: 40, top: 64}}>
                <Menu
                    theme={this.props.darkmode ? "dark" : "light"}
                    mode="inline"
                    defaultSelectedKeys={[this.getActivePage()]}
                    defaultOpenKeys={[this.getActiveCategory()]}
                    style={{height: '100%', borderRight: 0, background: this.props.darkmode ? "#141414" : null}}
                    onOpenChange={(v) => {
                        this.onMenuOpenChange(v)
                    }}
                    ref={this.setMenuRef}
                    {...this.state.openSelection}
                >

                    {categories.map(category => {
                        return <SubMenu key={category.name} icon={category.icon} title={category.name}>
                            {category.items.map(item => {
                                return <Menu.Item key={item.path}>
                                    <Link to={item.path}>{item.name}</Link>
                                </Menu.Item>
                            })}
                        </SubMenu>
                    })}
                </Menu>
            </Sider>

            <Suspense fallback={<Skeleton/>}>
                <Layout onClick={() => {
                    this.clickedOutSideMenu();
                }} style={{
                    padding: '0 24px 24px',
                    background: this.props.darkmode ? "#222222" : null,
                    color: this.props.darkmode ? "white" : "black"
                }}>
                    <Content
                        className="site-layout-background page-content"
                        style={{
                            padding: 24,
                            minHeight: 280,
                            position: "absolute",
                            left: 200,
                            right: 0,
                            top: 50,
                            bottom: 0,
                            overflowWrap: "break-word",
                            overflowY: "auto"
                        }}
                    >
                        <Row>
                            <Col span={24}>
                                <BreadcrumbPath darkmode={this.props.darkmode} style={{margin: '16px 0'}}/>&nbsp;
                            </Col>
                        </Row>

                        <Switch>
                            <Route path={"/account/details"}>
                                <AccountDetails darkmode={this.props.darkmode} apikey={this.props.apikey}/>
                            </Route>

                            <Route path={"/account/privacy"}>
                                <Title style={{color: this.props.darkmode ? "white" : "black"}}>WIP</Title>
                            </Route>

                            <Route path={"/applications"}>
                                <Applications mobile={this.state.onMobile} darkmode={this.props.darkmode}
                                              apikey={this.props.apikey}/>
                            </Route>

                            <Route path={"/account"}>
                                <Redirect to={"/account/details"}/>
                            </Route>
                        </Switch>

                        <Footer style={{
                            backgroundColor: this.props.darkmode ? "#222222" : null,
                            color: this.props.darkmode ? "white" : "black",
                            textAlign: "center"
                        }}>G-Development, Kane
                            Petra &#xa9; {new Date().getFullYear() === 2021 ? new Date().getFullYear() : `2021 - ${new Date().getFullYear()}`}</Footer>
                    </Content>
                </Layout>
            </Suspense>

            <MenuOutlined className={"mobile-menu"} onClick={() => {
                this.onCollapse(!this.state.sideCollapsed)
            }}/>
        </Layout>
    }
}

export default Dashboard
