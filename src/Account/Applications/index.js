import React from "react"
import {Route, Switch} from "react-router-dom";
import Websites from "./Websites";
import Website from "./Website";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000
});

export default class Applications extends React.Component {

    constructor(props) {
        super(props);

        api.defaults.headers = {
            "key": this.props.apikey,
            "Content-Type": "application/json"
        }
    }

    render() {
        return <div>
            <Switch>
                <Route path={"/applications/website/:id"} render={(props) => <Website api={api} apikey={this.props.apikey} {...props} />} />

                <Route path={"/applications/websites"}>
                    <Websites api={api} apikey={this.props.apikey}/>
                </Route>
            </Switch>
        </div>
    }
}