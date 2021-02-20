import React from "react"
import {Route, Switch} from "react-router-dom";
import axios from "axios";

const Websites = React.lazy(() => import("./Websites"))
const Website = React.lazy(() => import("./Website"))

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000
});

export default class Applications extends React.Component {

    constructor(props) {
        super(props);

        api.defaults.headers = {
            "Authorization": this.props.apikey,
            "Content-Type": "application/json"
        }
    }

    render() {
        return <div>
            <Switch>
                <Route path={"/applications/website/:id"} render={(props) => <Website darkmode={this.props.darkmode} api={api} apikey={this.props.apikey} {...props} />} />

                <Route path={"/applications/websites"}>
                    <Websites darkmode={this.props.darkmode} api={api} apikey={this.props.apikey}/>
                </Route>
            </Switch>
        </div>
    }
}