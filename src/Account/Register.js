import * as React from "react";

import { Form, Input, Button } from 'antd';
import Title from "antd/es/typography/Title";
import {Link, Redirect} from "react-router-dom";
import axios from "axios"
import ReCAPTCHA from "react-google-recaptcha";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000
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

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err: null,
            registering: false,
            redirect: null
        }

        this.onFinish = this.onFinish.bind(this);
    }

    onFinish(values) {
        this.setState({
            registering: true
        })

        console.log(values)

        api.post("account/register", values)
            .then(res => {
                if(res.data.success) {
                    this.setState({
                        err: "Registration successful! Logging in...",
                        registering: false
                    })

                    setTimeout(() => {
                        api.post("account/login", {username: values.username, password: values.password})
                            .then(res => {
                                if (res.data.success) {
                                    this.setState({
                                        err: "Login successful, redirecting to home page..."
                                    })

                                    this.props.setApiKey(res.data.message);

                                    setTimeout(() => {
                                        this.props.loggedIn();
                                    }, 1500)
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
                    }, 1000)

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

    componentDidMount() {
        api.defaults.headers = {
            "key": localStorage.getItem("apikey")
        }

        api.get("account/authenticated")
            .then(res => {
                if(res.data.success) {
                    this.setState({
                        redirect: true
                    })
                }
            })
            .catch(e => {})
    }

    render() {
        if(this.state.redirect)
            return <Redirect to={"/account/details"}></Redirect>

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

                    <Form.Item label={"Captcha"} style={{textAlign: "center", width: "100%"}} name="RecaptchaToken">
                        <ReCAPTCHA sitekey={"6Lec9loaAAAAAHS_hxY4lrBzZIeP2tUIgn90KVBK"} />
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

export default Register