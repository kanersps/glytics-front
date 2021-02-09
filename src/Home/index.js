import { Component } from "react";
import {Button, Layout} from "antd";

export default class Home extends Component {
    render() {
        return (
            <Layout>
                <div style={{textAlign: "center"}}>
                    <div style={{ fontSize: "2.5em", fontWeight: "600"}}>G-Lytics</div>
                    <div style={{ fontSize: "1.8em"}}>Simple, private and open source web analytics</div>

                    <table style={{marginLeft: "auto", marginRight: "auto", tableLayout: "fixed", width: "100%"}}>
                        <tr>
                            <td>
                                <Button width type={"primary"} style={{marginRight: "1em", width: "100%"}} size={"large"}>Login</Button>
                            </td>
                            <td>
                                <Button style={{marginLeft: "1em", width: "100%"}} size={"large"}>Register</Button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div></div>
            </Layout>
        )
    }
}