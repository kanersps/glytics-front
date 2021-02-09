import * as React from "react";

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Title from "antd/es/typography/Title";
import { Link } from "react-router-dom";
import axios from "axios"

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 2000,
    headers: { 'X-Custom-Header': 'foobar' }
});

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err: null,
            loggingIn: false
        }

        this.onFinish = this.onFinish.bind(this);
    }

    onFinish(values) {
        this.setState({
            loggingIn: true
        })

        api.post("account/login", values)
            .then(res => {
                if(res.data.success) {
                    this.setState({
                        err: "Loggin successfull, redirecting to home page...",
                        loggingIn: false
                    })
                } else {
                    this.setState({
                        err: "<span style='color: red'>" + res.data.message + "</span>",
                        loggingIn: false
                    })
                }
            })
            .catch(err => {
                this.setState({
                    err: "<span style='color: red'>" + err.message + "</span>",
                    registering: false
                })
            })
    }

    render() {
        return (
            <div style={{textAlign: "center"}}>
                <Title>Login</Title>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        { (this.state.err && !this.state.loggingIn) ? <div dangerouslySetInnerHTML={{__html: this.state.err}} /> : <div>&nbsp;</div> }
                    </div>

                    <Button loading={this.state.loggingIn} type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button> <br />
                    Or <br /><Link to={"/account/register"}>
                        <Button>
                            Register now
                        </Button>
                    </Link>
                </Form.Item>
                </Form>
            </div>
        )
    }
}