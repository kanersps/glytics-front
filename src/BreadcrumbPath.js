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
                if (index > 1) {
                    if (index !== this.props.location.pathname.split("/").length - 1) {
                        return <Breadcrumb.Item><Link
                            to={
                                this.props.location.pathname.substr(0, this.props.location.pathname.indexOf(item))
                            }>{capitalizeFirstLetter(item)}</Link></Breadcrumb.Item>

                    } else {
                        return <Breadcrumb.Item>{capitalizeFirstLetter(item)}</Breadcrumb.Item>
                    }
                }

                return ""
            })}
        </Breadcrumb>
    }
}

export default withRouter(BreadcrumbPath)