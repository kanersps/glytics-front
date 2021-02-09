import './App.css';
import BreadcrumbPath from "./BreadcrumbPath";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";

import { Layout } from 'antd';
import Home from "./Home";

import {useMediaQuery} from "react-responsive";
import Account from "./Account";

const { Content, Footer } = Layout;

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}

function App() {
  return (
    <BrowserRouter>
        <Layout className="layout">
            <Desktop>
                <Header />
            </Desktop>

            <Switch>
                <Route path="/account">
                    <Account></Account>
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
