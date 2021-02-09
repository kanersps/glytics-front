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
        const { cookies } = this.props;

        cookies.remove("apikey")
        window.location.reload(false);
    }

    setApiKey = (key) => {
        const { cookies } = this.props;

        cookies.set("apikey", key)
    }

    render() {
        const { cookies } = this.props;

        return (
          <BrowserRouter>
              <Layout className="layout">
                  <Desktop>
                      <Header />
                  </Desktop>

                  <Switch>
                      <Route path="/account">
                          <Account logout={this.logout} setApiKey={this.setApiKey} setLoggedIn={this.loggedIn} loggedIn={this.state.loggedIn} apikey={cookies.get("apikey")}></Account>
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
