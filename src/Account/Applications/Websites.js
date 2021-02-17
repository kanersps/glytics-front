import React from "react";
import Title from "antd/es/typography/Title";
import {DownOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Divider, Input, Space, Table, Dropdown, Menu, Popconfirm, Row, Col, Form} from "antd";
import * as PropTypes from "prop-types";
import Highlighter from 'react-highlight-words';
import Modal from "antd/es/modal/Modal";
import WebsiteSimpleDetails from "./WebsiteSimpleDetails";

SearchOutlined.propTypes = {style: PropTypes.shape({color: PropTypes.any})};

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
            errorMessageAddWebsite: "",
            actionMenuTarget: "",
            actionMenuAction: "",
            websiteDetailsVisible: false,
            websiteDetailsID: "",
            shouldReloadWebsiteDetails: 0
        }
    }

    componentDidMount() {
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
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? 'rgb(0, 0, 200)' : "rgb(0,0,0)"}}/>,
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
            this.state.searchColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                <span>{ text }</span>
            ),
    });

    reloadWebsites() {
        this.setState({
            loadingWebsites: true
        })

        this.props.api.get("application/website/all")
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

            return {loaderActive}
        })
    }

    setPopupActive(id, bool) {
        this.setState(prevState => {
            if(id.split("_")[0] === ("delete") || id.split("_")[0] === ("deactivate")) {
                id = "actionmenu_" + id.split("_")[1];
            }

            let popupActive = Object.assign({}, prevState.popupActive);
            popupActive[id] = bool;

            return {popupActive}
        })
    }

    handleActionMenu() {
        const key = this.state.actionMenuTarget;
        const action = key.split("_");

        if(action[0] === "delete" || action[0] === "deactivate")
            this.setLoaderActive("actionmenu_" + action[1], true);
        else
            this.setLoaderActive(key, true);

        // eslint-disable-next-line
        switch (action[0]) {
            case "deactivate": {
                this.props.api.post("application/website/deactivate", {
                    trackingCode: action[1]
                })
                    .then(_ => {
                        if(action[0] === "delete" || action[0] === "deactivate") {
                            this.setLoaderActive("actionmenu_" + action[1], false);
                            this.setPopupActive("actionmenu_" + action[1], false);
                        }else {
                            this.setLoaderActive(key, false);
                            this.setPopupActive(key, false)
                        }

                        this.reloadWebsites()
                    })
                    .catch(err => {
                        alert(err.message)

                        if(action[0] === "delete" || action[0] === "deactivate") {
                            this.setLoaderActive("actionmenu_" + action[1], false);
                            this.setPopupActive("actionmenu_" + action[1], false);
                        }else {
                            this.setLoaderActive(key, false);
                            this.setPopupActive(key, false)
                        }
                    })
                break;
            }
            case "d-delete":
            case "delete": {
                this.props.api.post("application/website/delete", {
                    trackingCode: action[1]
                })
                    .then(_ => {
                        if(action[0] === "delete" || action[0] === "deactivate") {
                            this.setLoaderActive("actionmenu_" + action[1], false);
                            this.setPopupActive("actionmenu_" + action[1], false);
                        }else {
                            this.setLoaderActive(key, false);
                            this.setPopupActive(key, false)
                        }

                        this.reloadWebsites()
                    })
                    .catch(err => {
                        alert(err.message)

                        if(action[0] === "delete" || action[0] === "deactivate") {
                            this.setLoaderActive("actionmenu_" + action[1], false);
                            this.setPopupActive("actionmenu_" + action[1], false);
                        }else {
                            this.setLoaderActive(key, false);
                            this.setPopupActive(key, false)
                        }
                    })
                break;
            }
        }
    }

    activateWebsite(key) {
        const action = key.split("_");

        this.setLoaderActive(key, true);

        this.props.api.post("application/website/activate", {
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
    }

    setActionMenuTarget(target) {
        this.setState({
            actionMenuTarget: target,
            actionMenuAction: target.split("_")[0]
        })
    }

    showWebsiteDetails(id) {
        this.setState({
            websiteDetailsVisible: true,
            websiteDetailsID: id,
            shouldReloadWebsiteDetails: this.state.shouldReloadWebsiteDetails + 1
        })
    }

    hideWebsiteDetails() {
        this.setState({
            websiteDetailsVisible: false
        })
    }

    render() {
        const activeWebsiteColumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => {
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                },
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                sorter: (a, b) => {
                    if(a.address < b.address) return -1;
                    if(a.address > b.address) return 1;
                },
            },
            {
                title: 'Tracking Code',
                dataIndex: 'trackingCode',
                key: 'trackingCode'
            },
            {
                title: "Action",
                dataIndex: "",
                width: 300,
                key: "action",
                render: (_, record) => <div>
                    <Button onClick={() => {
                        this.showWebsiteDetails(record.trackingCode)
                    }}>Details</Button>
                    &nbsp;
                    <Popconfirm onCancel={() => this.setPopupActive("actionmenu_" + record.trackingCode, false)}
                                visible={this.state.popupActive["actionmenu_" + record.trackingCode]}
                                okButtonProps={{loading: this.state.loaderActive["actionmenu_" + record.trackingCode]}}
                                onConfirm={() => {
                                    this.handleActionMenu();
                                }} title={"Are you sure you want to " + this.state.actionMenuAction + " " + record.name + "?"}>
                        <Dropdown trigger={"click"} overlay={
                            <Menu>
                                <Menu.Item onClick={() => {
                                    this.setPopupActive("deactivate_" + record.trackingCode, true);
                                    this.setActionMenuTarget("deactivate_" + record.trackingCode)
                                }} key={"deactivate_" + record.trackingcode}>

                                    <div style={{width: "100%", height: "calc(100% + 5px)"}}>Deactivate</div>

                                </Menu.Item>

                                <Menu.Item onClick={() => {
                                    this.setPopupActive("delete_" + record.trackingCode, true);
                                    this.setActionMenuTarget("delete_" + record.trackingCode)
                                }} danger key={"delete_" + record.trackingcode}>
                                    <div>Delete</div>
                                </Menu.Item>
                            </Menu>
                        }>
                            <Button>Extra Actions <DownOutlined/> </Button>
                        </Dropdown>
                    </Popconfirm>
                </div>
            }
        ]

        const inactiveWebsiteColumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => {
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                },
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                sorter: (a, b) => {
                    if(a.address < b.address) return -1;
                    if(a.address > b.address) return 1;
                },
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
                    <Button onClick={() => this.activateWebsite("d-activate_" + record.trackingCode)}
                            loading={this.state.loaderActive["d-activate_" + record.trackingCode]}
                            style={{marginRight: 5}}>Activate</Button>

                        <Popconfirm onCancel={() => this.setPopupActive("d-delete_" + record.trackingCode, false)}
                                    onClick={() => this.setPopupActive("d-delete_" + record.trackingCode, true)}
                                    visible={this.state.popupActive["d-delete_" + record.trackingCode]}
                                    okButtonProps={{loading: this.state.loaderActive["d-delete_" + record.trackingCode]}}
                                    onConfirm={() => {
                                        this.setActionMenuTarget("d-delete_" + record.trackingCode)
                                        this.handleActionMenu();
                                    }} title={"Are you sure you want to delete " + record.name + "?"}>
                            <Button danger>Delete</Button>
                        </Popconfirm>
                </div>
            }
        ]

        const showModal = () => {
            this.setWebsiteFormVisible(true);
        };

        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };

        const onAddWebsite = (values) => {
            this.setWebsiteFormLoading(true);

            this.props.api.post("application/website/create", values)
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
            <Table showSorterTooltip={false} className={this.props.darkmode ? "darkmode" : null} loading={this.state.loadingWebsites} title={() => <div>
                <Row style={{background: this.props.darkmode ? "#303030" : null, color: this.props.darkmode ? "white" : "black"}}>
                    <Col span={20}>
                        <Title style={{color: this.props.darkmode ? "white" : "black"}} level={3}>Active Websites</Title>
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

            <Table showSorterTooltip={false} className={this.props.darkmode ? "darkmode" : null} loading={this.state.loadingWebsites} title={() => <Title style={{color: this.props.darkmode ? "white" : "black"}} level={3}>Inactive Websites</Title>}
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
                            <Button onClick={() => {
                                this.setWebsiteFormVisible();
                            }} disabled={this.state.websiteFormLoading}>
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

            <WebsiteSimpleDetails darkmode={this.props.darkmode} api={this.props.api} reload={this.state.shouldReloadWebsiteDetails} code={this.state.websiteDetailsID} visible={this.state.websiteDetailsVisible} close={() => {
                this.hideWebsiteDetails();
            }}/>
        </div>
    }
}

export default Websites;