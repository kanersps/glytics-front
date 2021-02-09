import {Button, Row, Col, Layout, Menu} from "antd";
import {HomeOutlined, UserOutlined} from "@ant-design/icons";
import BreadcrumbPath from "../BreadcrumbPath";
import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import Sider from "antd/es/layout/Sider";
import SubMenu from "antd/es/menu/SubMenu";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import Title from "antd/es/typography/Title";

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 2000
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: undefined,
            username: "",
            passwordHash: ""
        }
    }

    getDashboard() {
        api.get("account")
            .then(res => {
                this.setState({
                    username: res.data.username,
                    passwordHash: res.data.password
                })
            })
    }

    checkApiKey(prevProps, force) {
        if(force || this.props.apikey != prevProps.apikey) {
            api.defaults.headers = {
                "key": this.props.apikey
            }

            api.get("account/authenticated")
                .then(res => {
                    if(!res.data.success) {
                        this.setState({redirect: "/account/login"})
                    } else {
                        this.getDashboard()
                    }
                })
                .catch(e => {
                    this.setState({redirect: "/account/login"})
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
        if(this.state.redirect)
            return <Redirect to={this.state.redirect} />

        return <Layout>
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                >


                    <SubMenu key="sub1" icon={<UserOutlined />} title="Account">
                        <Menu.Item key="1">Details</Menu.Item>
                        <Menu.Item key="2">Privacy</Menu.Item>
                    </SubMenu>

                    <SubMenu key="sub2" icon={<HomeOutlined />} title="Applications">
                        <Menu.Item key="1">Websites</Menu.Item>
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
                    <Row>
                        <Col span={20}>
                            <Title>Welcome, { this.state.username }</Title>
                        </Col>
                        <Col span={4}>
                            <Button onClick={this.props.logout}>Logout</Button>
                        </Col>
                    </Row>

                    <b>Debug Info:</b><br/>
                    Password: <br/>{ this.state.passwordHash }<br/><br/>
                    API Key: <br/>{ this.props.apikey }
                </Content>
            </Layout>
        </Layout>
    }
}

export default Dashboard