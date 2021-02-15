import { Component } from "react";
import {Button, Layout} from "antd";
import { useMediaQuery } from "react-responsive";
import {Link} from "react-router-dom";

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}

const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

export default class Home extends Component {
    render() {
        return (
            <Layout>
                <div style={{textAlign: "center", marginTop: 100 }}>
                    <div style={{ fontSize: "2.5em", fontWeight: "600"}}>G-Lytics</div>
                    <div style={{ fontSize: "1.8em", marginBottom: 30 }}>Simple, private and open source web analytics</div>

                    <Desktop>
                        <table style={{marginLeft: "auto", marginRight: "auto", tableLayout: "fixed", width: "600px"}}>
                            <tr>
                                <td>
                                    <Link to={"/account/login"}><Button width type={"primary"} style={{marginRight: "1em", width: "100%"}} size={"large"}>Login</Button></Link>
                                </td>
                                <td>
                                    <Link to={"/account/register"}><Button style={{marginLeft: "1em", width: "100%"}} size={"large"}>Register</Button></Link>
                                </td>
                            </tr>
                        </table>
                    </Desktop>

                    <Mobile>
                        <Link to={"/account/login"}><Button width type={"primary"} block={true}>Login</Button></Link>
                        <Link to={"/account/register"}><Button style={{ marginTop: 10 }} block={true}>Register</Button></Link>
                    </Mobile>
                </div>

                <div></div>
            </Layout>
        )
    }
}