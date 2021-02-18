import * as React from "react";

import { Layout } from 'antd';

import {Route, Switch, Redirect} from "react-router-dom";
import {Footer} from "antd/es/layout/layout";

const Login = React.lazy(() => import("./Login"))
const Register = React.lazy(() => import("./Register"))
const Dashboard = React.lazy(() => import("./Dashboard"))

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            loggedIn: false
        }
    }

    render() {
        return <Layout style={{marginTop: 50 }}>
            <Switch>
                <Route path={"/account/login"}>
                    { this.props.loggedIn === true || localStorage.getItem("apikey")  ? <Redirect to={"/account/details"} /> : <Login darkmode={this.props.darkmode} apikey={this.props.apikey} loggedIn={this.props.setLoggedIn} /> }
                </Route>

                <Route path={"/account/register"}>
                    { this.props.loggedIn === true || localStorage.getItem("apikey") ? <Redirect to={"/account/details"} /> : <Register darkmode={this.props.darkmode} apikey={this.props.apikey} setApiKey={this.props.setApiKey} loggedIn={this.props.setLoggedIn} /> }
                </Route>

                <Route path={["/account", "/applications"]}>
                    { this.props.loggedIn === false && !localStorage.getItem("apikey") ? <Redirect to={"/account/login"} /> : <Dashboard setAccountName={this.props.setAccountName} darkmode={this.props.darkmode} update={this.props.shouldUpdateDashboard} updateDashboardTo={this.props.updateDashboardTo} updateDashboardToCategory={this.props.updateDashboardToCategory} logout={this.props.logout} apikey={this.props.apikey} loggedIn={this.props.setLoggedIn} /> }
                </Route>

                </Switch>

            <Footer style={{backgroundColor: this.props.darkmode ? "#222222" : null, color: this.props.darkmode ? "white" : "black", textAlign: "center"}}>G-Development, Kane Petra &#xa9; { new Date().getFullYear() === 2021 ? new Date().getFullYear() : `2021 - ${ new Date().getFullYear() }`}</Footer>

        </Layout>
    }
}

export default Account