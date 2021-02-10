import React from "react";
import Title from "antd/es/typography/Title";
import {DownOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Divider, Input, Space, Table, Dropdown, Menu, Popconfirm, Row, Col} from "antd";
import * as PropTypes from "prop-types";

SearchOutlined.propTypes = {style: PropTypes.shape({color: PropTypes.any})};

class Highlighter extends React.Component {
    render() {
        return null;
    }
}

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
            activeWebsites: [
                {
                    name: "G-Lytics Main Site",
                    address: "g-lytics.com",
                    trackingcode: "GL-040002"
                }
            ],
            inactiveWebsites: [],
            searchText: "",
            searchColumn: ""
        }
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
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
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    handleActionMenu(key) {
        const action = key.split("_");

        // eslint-disable-next-line
        switch(action[0]) {
            case "deactivate": {
                console.log("Deactivate: " + action[1])
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
            },
            {
                title: 'Tracking Code',
                dataIndex: 'trackingcode',
                key: 'trackingcode',
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
                                    <Popconfirm onConfirm={() => {
                                        this.handleActionMenu("deactivate_" + record.trackingcode);
                                    }} title={"Are you sure you want to de-activate " + record.name + "?"}>
                                        <div>Deactivate</div>
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
                dataIndex: 'trackingcode',
                key: 'trackingcode',
            }
        ]

        return <div>
            <Table title={() => <div>
                <Row>
                    <Col span={20}>
                        <Title level={3}>Active Websites</Title>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: "right"}}>
                            <Button type={"primary"}>Add</Button>
                        </div>
                    </Col>
                </Row>
            </div>} size={"medium"} dataSource={this.state.activeWebsites} columns={activeWebsiteColumns} />

            <Divider />

            <Table title={() => <Title level={3}>Inactive Websites</Title>} size={"medium"} dataSource={this.state.inactiveWebsites} columns={inactiveWebsiteColumns} />
        </div>
    }
}

export default Websites;