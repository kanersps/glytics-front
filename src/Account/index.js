import * as React from "react";

import { Layout } from 'antd';

import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

import Dashboard from "./Dashboard";

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            loggedIn: false
        }
    }

    render() {
        return <Layout style={{ marginTop: 20 }}>
            <Switch>
                <Route path={"/account/login"}>
                    { this.props.loggedIn === true ? <Redirect to={"/account/details"} /> : <Login loggedIn={this.props.setLoggedIn} /> }
                </Route>

                <Route path={"/account/register"}>
                    { this.props.loggedIn === true ? <Redirect to={"/account/details"} /> : <Register setApiKey={this.props.setApiKey} loggedIn={this.props.setLoggedIn} /> }
                </Route>

                <Route path={"/account"}>
                    { this.props.loggedIn === false && this.props.apikey === undefined ? <Redirect to={"/account/login"} /> : <Dashboard logout={this.props.logout} apikey={this.props.apikey} /> }
                </Route>
            </Switch>
        </Layout>
    }
}

export default Account