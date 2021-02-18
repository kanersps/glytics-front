import './App.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";

import {Layout, Skeleton} from 'antd';
import Home from "./Home";

import {useMediaQuery} from "react-responsive";
import {withCookies} from "react-cookie";

import React, { Suspense } from "react"

const Account = React.lazy(() => import("./Account"))

const { Content, Footer } = Layout;

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            apiKey: "",
            accountName: "",
            updateDashboard: 0,
            updateDashboardTo: "",
            updateDashboardToCategory: "",
            darkmode: (localStorage.getItem("darkmode") === "1")
        }
    }

    toggleDarkMode() {
        this.setState({
            darkmode: !this.state.darkmode
        }, () => {
            localStorage.setItem("darkmode", (this.state.darkmode ? "1" : "0"))
        })
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

    setAccountName = (name) => {
        this.setState({
            accountName: name
        })
    }

    updateDashboard(category, to) {
        console.log(to)
        this.setState((prevState) => {
            let updateDashboard = prevState.updateDashboard;
            let updateDashboardTo = prevState.updateDashboardTo;
            let updateDashboardToCategory = prevState.updateDashboardToCategory;

            updateDashboardTo = to;
            updateDashboardToCategory = category;
            updateDashboard++;

            return { updateDashboard, updateDashboardTo, updateDashboardToCategory }
        })
    }

    render() {
        return (
          <BrowserRouter style={{height: "100%"}}>
                  <Layout className="layout" style={{minHeight:"100vh", background: this.state.darkmode ? "#222222" : null }}>
                      <Desktop style={{position: "fixed"}}>
                          <Header accountName={this.state.accountName} darkmode={this.state.darkmode} toggleDarkMode={() => {this.toggleDarkMode()}} logout={() => {
                              this.logout();
                          }} updateDashboard={(a, b) => {this.updateDashboard(a, b)}} loggedIn={this.state.loggedIn} apikey={this.state.apiKey}  />
                      </Desktop>

                      <Suspense fallback={<Skeleton />}>
                          <div style={{marginTop: 20}}>
                              <Switch>
                                  <Route path={["/account", "/applications"]}>
                                      <Account setAccountName={(name) => {this.setAccountName(name)}} darkmode={this.state.darkmode} logout={this.logout} updateDashboardTo={this.state.updateDashboardTo} updateDashboardToCategory={this.state.updateDashboardToCategory} shouldUpdateDashboard={this.state.updateDashboard} setApiKey={this.setApiKey} setLoggedIn={this.loggedIn} loggedIn={this.state.loggedIn} apikey={localStorage.getItem("apikey")}/>
                                  </Route>

                                  <Route path="/">
                                      <Content style={{ padding: '0 50px'}}>
                                          <div className="site-layout-content" style={{ margin: "16px 0"}}>
                                              <Home darkmode={this.state.darkmode}  />
                                          </div>

                                          <Footer style={{backgroundColor: this.state.darkmode ? "#222222" : null, color: this.state.darkmode ? "white" : "black", textAlign: "center"}}>G-Development, Kane Petra &#xa9; { new Date().getFullYear() === 2021 ? new Date().getFullYear() : `2021 - ${ new Date().getFullYear() }`}</Footer>
                                      </Content>
                                  </Route>
                              </Switch>
                          </div>
                      </Suspense>
                  </Layout>
          </BrowserRouter>
      );
  }
}

export default withCookies(App);
