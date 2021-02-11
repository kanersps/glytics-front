import React from "react";
import {Button, Row, Card, Col, Drawer, Skeleton, Statistic, PageHeader, Divider} from "antd";
import Title from "antd/es/typography/Title";
import {ArrowDownOutlined, ArrowUpOutlined, HomeOutlined} from "@ant-design/icons";

class WebsiteSimpleDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            address: "",
            name: "",
            hourlyViews: 0,
            hourlyVisitors: 0
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.code !== prevProps.code) {
            this.setState({
                loading: true
            })

            this.props.api.post("application/website/details/simple", { trackingCode: this.props.code })
                .then(res => {
                    console.log(res);

                    this.setState({
                        loading: false,
                        address: res.data.address,
                        name: res.data.name,
                        lastHourViews: res.data.lasthourViews,
                        lastHourVisitors: res.data.lasthourVisitors
                    })
                })
        }
    }

    render () {

        let content = <Skeleton paragraph={{ rows: 10 }} />

        if (!this.state.loading) {
            content = <Row gutter={8}>
                <Col span={24}>
                    <span style={{ fontWeight: "bold", fontSize: "2em" }}> {this.state.name }</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;<a href={this.state.address}>{ this.state.address }</a> </span>

                    <Divider/>
                </Col>

                <Col span={24}>
                    <Title level={4}>Hourly</Title>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Visitors"
                                    value={ this.state.lastHourVisitors }
                                    precision={0}
                                    suffix=" people"
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Views"
                                    value={ this.state.lastHourViews }
                                    precision={0}
                                    suffix=" pages"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

            </Row>
        }

        return <Drawer
            title="Website Details"
            width={720}
            onClose={this.props.close}
            visible={this.props.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                        Close
                    </Button>
                </div>
            }
        >
            { content }
        </Drawer>
    }
}

export default WebsiteSimpleDetails