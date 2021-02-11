import React from "react";
import { Line } from '@ant-design/charts';
import {Button, Card, Col, Divider, PageHeader, Row, Skeleton, Statistic} from "antd";
import Title from "antd/lib/typography/Title";
import {Link} from "react-router-dom";
import {ReloadOutlined} from "@ant-design/icons";

class Website extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hourly: [],
            fullData: [],
            name: "",
            loading: true,
            reloading: false,
            lastMonthVisits: 0,
            lastMonthViews: 0,
            previousMonthVisitors: 0,
            previousMonthViews: 0,
        }
    }

    formatDate(date) {
        let t = date;
        return (t.getDay() < 10 ? "0" + t.getDay() : t.getDay()) + "-" + (t.getMonth() < 10 ? "0" + t.getMonth() : t.getMonth()) + " " + (t.getHours() < 10 ? "0" + t.getHours() : t.getHours()) + ":00"
    }

    reloadWebsite() {
        this.setState({
            reloading: true
        })

        this.props.api.post("application/website/details", { trackingCode: this.props.match.params.id })
            .then(res => {
                let data = [];

                res.data.hourly.map(hour => {
                    data.push({
                        timestamp: this.formatDate(new Date(hour.timestamp)),
                        key: "Visits",
                        value: hour.visits
                    })

                    data.push({
                        timestamp: this.formatDate(new Date(hour.timestamp)),
                        key: "Views",
                        value: hour.pageViews
                    })
                })

                data.sort((a, b) => {
                    return a.timestamp > b.timestamp ? 1 : 0
                })

                res.data.hourly.sort((a, b) => {
                    return a.timestamp > b.timestamp ? 1 : 0
                })

                let lastMonthViews = 0;
                let lastMonthVisits = 0;

                res.data.hourly.map(h => {
                    lastMonthViews += h.pageViews
                    lastMonthVisits += h.visits
                })

                this.setState({
                    hourly: data,
                    name: res.data.name,
                    loading: false,
                    reloading: false,
                    fullData: res.data.hourly,
                    lastMonthViews: lastMonthViews,
                    lastMonthVisits: lastMonthVisits
                })
            })
    }
    componentDidMount() {
        this.reloadWebsite();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.id !== this.props.match.params.id) {
            this.reloadWebsite();
        }
    }

    render() {
        if(this.state.loading)
            return <Skeleton/>

        let data = this.state.hourly;

        const configHourlyData = {
            data,
            height: 300,
            xField: 'timestamp',
            yField: 'value',
            point: {
                size: 5,
                shape: 'diamond',
            },
            seriesField: 'key',
        };

        return <Row gutter={8}>
            <Col span={24}>
                <Row>
                    <Col span={20}>
                        <Title>{ this.state.name }</Title>
                    </Col>
                    <Col span={4} style={{textAlign: "right"}}>
                        <Button onClick={() => {this.reloadWebsite()}} loading={ this.state.reloading } icon={ <ReloadOutlined/> }>Reload</Button>
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Visitors in the last hour"
                                value={ this.state.fullData.length === 0 ? 0 : this.state.fullData[this.state.fullData.length - 1].visits }
                                precision={0}
                                suffix={this.state.fullData.length === 0 ? " people" : (this.state.fullData[this.state.fullData.length - 1].visits > 1 ? " people" : " person")}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Views in the last hour"
                                value={ this.state.fullData.length === 0 ? 0 : this.state.fullData[this.state.fullData.length - 1].pageViews }
                                precision={0}
                                suffix={this.state.fullData.length === 0 ? " pages" : (this.state.fullData[this.state.fullData.length - 1].pageViews > 1 ? " pages" : " page")}
                            />
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Visitors in the last month"
                                value={ this.state.lastMonthVisits }
                                precision={0}
                                suffix={ this.state.lastMonthVisits > 1 ? " people" : " person"}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Views in the last month"
                                value={ this.state.lastMonthViews }
                                precision={0}
                                suffix={ this.state.lastMonthViews > 1 ? " pages" : " page"}
                            />
                        </Card>
                    </Col>
                </Row>

                <Divider/>
            </Col>

            <Col span={24}>
                <Title level={3}>Graphs</Title>
            </Col>

            <Col span={10}>
                <Line {...configHourlyData} />
            </Col>
        </Row>;
    }
}

export default Website