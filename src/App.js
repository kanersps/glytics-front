import './App.css';
import BreadcrumbPath from "./BreadcrumbPath";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";

import { Layout } from 'antd';
import Home from "./Home";

import {useMediaQuery} from "react-responsive";
import Account from "./Account";
import {withCookies} from "react-cookie";

import React from "react"

const { Content, Footer } = Layout;

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false
        }
    }

    loggedIn = () => {
        this.setState({
            loggedIn: true
        })
    }

    logout = () => {
        localStorage.clear();

        setTimeout(() => {
            window.location.href = "/account/login"
        }, 1500)
    }

    setApiKey = (key) => {
        localStorage.setItem("apikey", key)
    }

    render() {
        return (
          <BrowserRouter style={{height: "100%"}}>
              <Layout className="layout" style={{minHeight:"100vh"}}>
                  <Desktop>
                      <Header />
                  </Desktop>

                  <Switch>
                      <Route path={["/account", "/applications"]}>
                          <Account logout={this.logout} setApiKey={this.setApiKey} setLoggedIn={this.loggedIn} loggedIn={this.state.loggedIn} apikey={localStorage.getItem("apikey")}/>
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
}

export default withCookies(App);
