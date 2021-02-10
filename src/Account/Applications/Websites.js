import React from "react";
import Title from "antd/es/typography/Title";
import {DownOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Divider, Input, Space, Table, Dropdown, Menu, Popconfirm, Row, Col, Form} from "antd";
import * as PropTypes from "prop-types";
import Modal from "antd/es/modal/Modal";
import axios from "axios";

SearchOutlined.propTypes = {style: PropTypes.shape({color: PropTypes.any})};

class Highlighter extends React.Component {
    render() {
        return null;
    }
}

const api = axios.create({
    baseURL: 'https://localhost:5001/',
    timeout: 2000
});

Highlighter.propTypes = {
    highlightStyle: PropTypes.shape({padding: PropTypes.number, backgroundColor: PropTypes.string}),
    textToHighlight: PropTypes.any,
    autoEscape: PropTypes.bool,
    searchWords: PropTypes.arrayOf(PropTypes.any)
};

class Websites extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeWebsites: [],
            inactiveWebsites: [],
            loadingWebsites: false,
            searchText: "",
            searchColumn: "",
            addWebsiteFormVisible: false,
            websiteFormLoading: false,
            loaderActive: {},
            popupActive: {},
            errorMessageAddWebsite: ""
        }
    }

    componentDidMount() {
        api.defaults.headers = {
            "key": this.props.apikey
        }

        this.reloadWebsites();
    }

    setWebsiteFormVisible(visible) {
        this.setState({
            addWebsiteFormVisible: visible
        })
    }

    setWebsiteFormLoading(loading) {
        this.setState({
            websiteFormLoading: loading
        })
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    reloadWebsites() {
        this.setState({
            loadingWebsites: true
        })

        api.get("application/website/all")
            .then(res => {
                let activeWebsites = []
                let inactiveWebsites = []

                for (let website of res.data) {
                    if (website.active)
                        activeWebsites.push(website);
                    else
                        inactiveWebsites.push(website);
                }

                this.setState({
                    activeWebsites: activeWebsites,
                    inactiveWebsites: inactiveWebsites,
                    loadingWebsites: false
                })
            })
            .catch((err) => {
                alert(err);
                this.setState({
                    loadingWebsites: false
                })
            })
    }

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };

    setLoaderActive(id, bool) {
        this.setState(prevState => {
            let loaderActive = Object.assign({}, prevState.loaderActive)
            loaderActive[id] = bool;

            return { loaderActive }
        })
    }

    setPopupActive(id, bool) {
        this.setState(prevState => {
            let popupActive = Object.assign({}, prevState.popupActive);
            popupActive[id] = bool;

            console.log(prevState)

            return { popupActive }
        })
    }

    handleActionMenu(key) {
        const action = key.split("_");

        this.setLoaderActive(key, true);

        // eslint-disable-next-line
        switch (action[0]) {
            case "deactivate": {
                api.post("application/website/deactivate", {
                    trackingCode: action[1]
                })
                    .then(_ => {
                        this.setLoaderActive(key, false);
                        this.setPopupActive(key, false)

                        this.reloadWebsites()
                    })
                    .catch(err => {
                        alert(err.message)

                        this.setLoaderActive(key, false);
                        this.setPopupActive(key, false)
                    })
                break;
            }
            case "delete": {
                api.post("application/website/delete", {
                    trackingCode: action[1]
                })
                    .then(_ => {
                        this.setLoaderActive(key, false);
                        this.setPopupActive(key, false)

                        this.reloadWebsites()
                    })
                    .catch(err => {
                        alert(err.message)

                        this.setLoaderActive(key, false);
                        this.setPopupActive(key, false)
                    })
                break;
            }
        }
    }


    render() {
        const activeWebsiteColumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps("name")
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                ...this.getColumnSearchProps("address")
            },
            {
                title: 'Tracking Code',
                dataIndex: 'trackingCode',
                key: 'trackingCode',
            },
            {
                title: "Action",
                dataIndex: "",
                width: 300,
                key: "action",
                render: (_, record) => <div>
                    <Button>Details</Button>
                    &nbsp;
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item key={"deactivate_" + record.trackingcode}>
                                <Popconfirm onCancel={() => this.setPopupActive("deactivate_" + record.trackingCode, false)}
                                            onClick={() => this.setPopupActive("deactivate_" + record.trackingCode, true)}
                                            visible={this.state.popupActive["deactivate_" + record.trackingCode]}
                                            okButtonProps={{loading: this.state.loaderActive["deactivate_" + record.trackingCode]}}
                                            onConfirm={() => {
                                                this.handleActionMenu("deactivate_" + record.trackingCode);
                                            }} title={"Are you sure you want to de-activate " + record.name + "?"}>
                                    <div>Deactivate</div>
                                </Popconfirm>
                            </Menu.Item>

                            <Menu.Item className={"ant-btn-dangerous"} key={"delete_" + record.trackingcode}>
                                <Popconfirm onCancel={() => this.setPopupActive("delete_" + record.trackingCode, false)}
                                            onClick={() => this.setPopupActive("delete_" + record.trackingCode, true)}
                                            visible={this.state.popupActive["delete_" + record.trackingCode]}
                                            okButtonProps={{loading: this.state.loaderActive["delete_" + record.trackingCode]}}
                                            onConfirm={() => {
                                                this.handleActionMenu("delete_" + record.trackingCode);
                                            }} title={"Are you sure you want to delete " + record.name + "?"}>
                                    <div>Delete</div>
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                    }>
                        <Button>Extra Actions <DownOutlined/> </Button>
                    </Dropdown>
                </div>
            }
        ]

        const inactiveWebsiteColumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Tracking Code',
                dataIndex: 'trackingCode',
                key: 'trackingCode',
            }
        ]

        const handleCancel = () => {
            this.setWebsiteFormVisible(false);
        };

        const showModal = () => {
            this.setWebsiteFormVisible(true);
        };

        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        const tailLayout = {
            wrapperCol: {offset: 8, span: 16},
        };

        const onAddWebsite = (values) => {
            this.setWebsiteFormLoading(true);

            api.post("application/website/create", values)
                .then(res => {
                    if (res.data.success) {
                        this.setWebsiteFormVisible(false);
                        this.setWebsiteFormLoading(false);

                        this.reloadWebsites()
                    } else {
                        this.setState({
                            errorMessageAddWebsite: res.data.message
                        })
                        this.setWebsiteFormLoading(false);
                    }
                })
                .catch(err => {
                    this.setState({
                        errorMessageAddWebsite: err.message
                    })
                    this.setWebsiteFormLoading(false);
                })
        }

        return <div>
            <Table loading={this.state.loadingWebsites} title={() => <div>
                <Row>
                    <Col span={20}>
                        <Title level={3}>Active Websites</Title>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: "right"}}>
                            <Button loading={this.state.loadingWebsites} onClick={() => {
                                this.reloadWebsites()
                            }} icon={<ReloadOutlined/>}/>
                            <Button onClick={showModal} type={"primary"} style={{marginLeft: 10}}>Add</Button>
                        </div>
                    </Col>
                </Row>
            </div>} size={"medium"} dataSource={this.state.activeWebsites} columns={activeWebsiteColumns}/>

            <Divider/>

            <Table loading={this.state.loadingWebsites} title={() => <Title level={3}>Inactive Websites</Title>}
                   size={"medium"} dataSource={this.state.inactiveWebsites} columns={inactiveWebsiteColumns}/>

            <Modal title={"Add new website"} footer="" visible={this.state.addWebsiteFormVisible}
                   confirmLoading={this.state.websiteFormLoading}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{remember: true}}
                    onFinish={onAddWebsite}
                    labelAlign={"left"}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please enter a name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{
                            required: true,
                            message: 'Please enter a web address'
                        }, {
                            pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
                            message: "Please enter a correct domain name without http:// & www. (g-lytics.com as example)"
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <div style={{textAlign: "right", padding: 10}}>
                        {(this.state.errorMessageAddWebsite && !this.state.websiteFormLoading) ?
                            <div dangerouslySetInnerHTML={{__html: this.state.errorMessageAddWebsite}}/> :
                            <div>&nbsp;</div>}
                    </div>


                    <Row gutter={8}>
                        <Col span={24} style={{textAlign: "right"}}>
                            <Button onClick={this.setWebsiteFormVisible} disabled={this.state.websiteFormLoading}>
                                Cancel
                            </Button>
                            <Button style={{margin: '0 8px'}} loading={this.state.websiteFormLoading} type="primary"
                                    htmlType="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    }
}

export default Websites;