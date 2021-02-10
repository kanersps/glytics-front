import React from "react"
import {Route, Switch} from "react-router-dom";
import Websites from "./Websites";

export default class Applications extends React.Component {
    render() {
        return <div>
            <Switch>
                <Route path={"/account/applications/websites"}>
                    <Websites apikey={ this.props.apikey }></Websites>
                </Route>
            </Switch>
        </div>
    }
}