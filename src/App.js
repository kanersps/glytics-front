import './App.css';
import BreadcrumbPath from "./BreadcrumbPath";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import Header from "./Header";

import { Layout, Menu } from 'antd';
import Home from "./Home";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

import MediaQuery from 'react-responsive'

function App() {
  return (
    <BrowserRouter>
        <Layout className="layout">
            <Header xs={8} />

            <Switch>
                <Route path="/account">
                    <Layout>
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
                    </Layout>
                </Route>

                <Route path="/">
                    <Content style={{ padding: '0 50px' }}>
                        <BreadcrumbPath style={{ margin: '16px 0' }} />

                        <div className="site-layout-content" style={{ margin: "16px 0"}}>
                            <Home />
                        </div>
                    </Content>
                </Route>
            </Switch>
            <Footer style={{ textAlign: 'center' }}>G-Development, Kane Petra &#xa9; { new Date().getFullYear() === 2021 ? new Date().getFullYear() : `2021 - ${ new Date().getFullYear() }`}</Footer>
        </Layout>
    </BrowserRouter>
  );
}

export default App;
