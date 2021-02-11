import React from "react"
import axios from "axios";
import Title from "antd/es/typography/Title";
import {Skeleton, Spin} from "antd";

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 5000
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

        setInterval(() => {
            this.setState({
                test: this.state.test + 1
            })
        }, 1000)

        this.getAccountDetails()
    }

    render() {
        if(this.state.loading)
            return <Skeleton paragraph={{ rows: 20 }}/>

        return <div>
            <Title>Welcome, { this.state.username }</Title>

            <b>Debug Info:</b><br/>
            Password: <br/>{ this.state.passwordHash }<br/><br/>
            API Key: <br/>{ this.props.apikey }
        </div>
    }
}

export default AccountDetails