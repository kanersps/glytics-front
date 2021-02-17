import React from "react";
import Avatar from "antd/lib/avatar/avatar";
import {UserOutlined, GlobalOutlined} from "@ant-design/icons";
import {AutoComplete, Divider, Dropdown, Menu} from "antd";
import Search from "antd/lib/input/Search";
import axios from "axios";
import {Link} from "react-router-dom";

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);

        this.searchTimeout = 0;

        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 5000
        });

        this.state = {
            searchTerm: "",
            lastSearch: Date.now(),
            searchLoading: false,
            searchResults: [
                {
                    label: this.renderTitle('Results for '),
                    options: [],
                }
            ]
        }
    }

    renderTitle = (title) => {
        return (
            <span>
                    {title}
                </span>
        );
    };

    renderItem = (title, location) => {
        return {
            value: title,
            label: (
                <Link key={title} onClick={() => {
                    this.props.updateDashboard("Applications", "/applications/websites");
                }} to={location} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    { title }
                    <span>
                          <GlobalOutlined/>
                        </span>
                </Link>
            ),
        };
    };

    search(s) {
        this.setState(prevState => {
            this.api.defaults.headers = {
                "key": localStorage.getItem("apikey")
            }

            let searchResults = Object.assign([], prevState.searchResults);

            searchResults[0] = {
                label: this.renderTitle("Results for " + s),
                options: []
            }

            if(this.searchTimeout)
                clearTimeout(this.searchTimeout)

            this.searchTimeout = setTimeout(() => {
                console.log("Search for: " + s);

                this.api.post("application/search", { Term: s })
                    .then((res) => {
                        let options = []

                        for(let option of res.data.results) {
                            options.push(this.renderItem(option.title, option.location))
                        }

                        this.setState({
                            searchResults: [
                                {
                                    label: this.renderTitle("Results for " + s),
                                    options: options
                                }
                            ],
                            searchLoading: false
                        })
                    })
                    .catch(err => {
                        this.setState({
                            searchResults: [
                                {
                                    label: this.renderTitle("Results for " + s),
                                    options: [this.renderItem(err.message, 0)]
                                }
                            ],
                            searchLoading: false
                        })
                    })
            }, 500)

            return {searchResults, searchTerm: s, searchLoading: true}
        })
    }


    render() {
        const options = this.state.searchResults;

        const menu = (
            <Menu style={{width: 200, background: this.props.darkmode ? "#121212" : null, color: this.props.darkmode ? "white" : "black"}}>
                <div style={{textAlign: "center", borderBottom: "1px solid gray", paddingBottom: 3}}>

                    <span style={{fontWeight: "bold"}}>{ this.props.name || "Unknown" }</span>
                </div>
                <Menu.Item danger onClick={this.props.logout}>Logout</Menu.Item>
            </Menu>
        );

        return <span>
                <Dropdown overlay={menu}>
                    <li className={"ant-menu-item ant-menu-item-only-child"} style={{float: "right"}}>
                        <div>
                            <Avatar size={32} icon={<UserOutlined/>}/>
                        </div>
                    </li>
                </Dropdown>
                <li className={"ant-menu-item ant-menu-item-only-child"} style={{float: "right"}}>
                        <AutoComplete
                            dropdownClassName="certain-category-search-dropdown"
                            dropdownMatchSelectWidth={500}
                            style={{width: 250}}
                            options={options}
                            onChange={(t) => {this.search(t)}}
                        >
                        <Search allowClear enterButton loading={this.state.searchLoading} placeholder="Enter search term"/>
                      </AutoComplete>
                </li>
        </span>
    }
}

export default LoggedIn