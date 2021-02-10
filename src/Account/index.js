import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import BreadcrumbPath from "../BreadcrumbPath";
import * as React from "react";

import { Layout, Menu } from 'antd';

import {useMediaQuery} from "react-responsive";
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

import {useCookies, withCookies} from "react-cookie";
import Dashboard from "./Dashboard";

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}

const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

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