import { Component } from "react";
import {Breadcrumb} from "antd";

import {Link, withRouter} from "react-router-dom";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class BreadcrumbPath extends Component {
    render() {
        return <Breadcrumb>
            {this.props.location.pathname.split("/").map((item, index) => {
                if (index > 0 && this.props.location.pathname.split("/").length > 2) {
                    return <Breadcrumb.Item>{capitalizeFirstLetter(item)}</Breadcrumb.Item>
                }

                return ""
            })}
        </Breadcrumb>
    }
}

export default withRouter(BreadcrumbPath)