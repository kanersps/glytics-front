import * as React from "react";

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Title from "antd/es/typography/Title";
import { Link } from "react-router-dom";
import axios from "axios"

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' }
});

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err: null,
            registering: false
        }

        this.onFinish = this.onFinish.bind(this);
    }

    onFinish(values) {
        this.setState({
            registering: true
        })

        api.post("account/register", values)
            .then(res => {
                if(res.data.success) {
                    this.setState({
                        err: "Registration successfull! Redirecting to home page...",
                        registering: false
                    })
                } else {
                    this.setState({
                        err: "<span style='color: red'>" + res.data.message + "</span>",
                        registering: false
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
                <Title>Register</Title>
                <Form
                    {...formItemLayout}
                    name="register"
                    className="register-form"
                    onFinish={this.onFinish}
                    labelAlign={"left"}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            { (this.state.err && !this.state.registering) ? <div dangerouslySetInnerHTML={{__html: this.state.err}} /> : <div>&nbsp;</div> }
                        </div>

                        <Button loading={this.state.registering} style={{width: "70%"}} size={"large"} type="primary" htmlType="submit" className="login-form-button">
                            Register
                        </Button> <br />
                        Or <br /><Link to={"/account/login"}>
                        <Button style={{width: "70%"}}>
                            Login
                        </Button>
                    </Link>
                </Form>
            </div>
        )
    }
}