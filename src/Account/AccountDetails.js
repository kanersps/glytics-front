import React from "react"
import axios from "axios";
import Title from "antd/es/typography/Title";
import {Spin} from "antd";

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 2000
});

class AccountDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            passwordHash: "",
            loading: true
        }
    }

    getAccountDetails() {
        api.get("account")
            .then(res => {
                this.setState({
                    username: res.data.username,
                    passwordHash: res.data.password,
                    loading: false
                })
            })
    }

    componentDidMount() {
        api.defaults.headers = {
            "key": this.props.apikey
        }

        this.getAccountDetails()
    }

    render() {
        return <Spin spinning={this.state.loading}>
            <Title>Welcome, { this.state.username }</Title>

            <b>Debug Info:</b><br/>
            Password: <br/>{ this.state.passwordHash }<br/><br/>
            API Key: <br/>{ this.props.apikey }
        </Spin>
    }
}

export default AccountDetails