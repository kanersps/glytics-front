import {Button, Row, Col, Layout, Menu} from "antd";
import {HomeOutlined, UserOutlined} from "@ant-design/icons";
import BreadcrumbPath from "../BreadcrumbPath";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import * as React from "react";
import Sider from "antd/es/layout/Sider";
import SubMenu from "antd/es/menu/SubMenu";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import Title from "antd/es/typography/Title";
import AccountDetails from "./AccountDetails";

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 2000
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    checkApiKey(prevProps, force) {
        if(force || this.props.apikey != prevProps.apikey) {
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
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                >


                    <SubMenu key="sub1" icon={<UserOutlined />} title="Account">
                        <Menu.Item key="1"><Link to={"/account/details"}>Details</Link></Menu.Item>
                        <Menu.Item key="2"><Link to={"/account/privacy"}>Privacy</Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key="sub2" icon={<HomeOutlined />} title="Applications">
                        <Menu.Item key="3"><Link to={"/account/applications/websites"}>Websites</Link></Menu.Item>
                    </SubMenu>
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

                        <Route path={"/account/applications/websites"}>
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