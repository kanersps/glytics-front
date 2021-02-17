import { Component } from "react";
import {Breadcrumb} from "antd";

import {withRouter} from "react-router-dom";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class BreadcrumbPath extends Component {
    render() {
        return <Breadcrumb separator={<span style={{color: this.props.darkmode ? "white" : "black"}}>/</span>} >
            {this.props.location.pathname.split("/").map((item, index) => {
                if (index > 0 && this.props.location.pathname.split("/").length > 2) {
                    return <Breadcrumb.Item style={{color: this.props.darkmode ? "white" : "black"}}>{capitalizeFirstLetter(item)}</Breadcrumb.Item>
                }

                return ""
            })}
        </Breadcrumb>
    }
}

export default withRouter(BreadcrumbPath)