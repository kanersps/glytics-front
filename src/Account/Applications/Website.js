import React from "react";
import {Button, Card, Col, Divider, Row, Skeleton, Statistic, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {ReloadOutlined} from "@ant-design/icons";
import Column from "@ant-design/charts/lib/column";

class Website extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hourly: [],
            hourlyPaths: [],
            hourlyPathsTable: [],
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

    formatDate(d) {
        return (("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
        d.getFullYear());
    }

    formatTooltip(d) {
        return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    }

    reloadWebsite() {
        this.setState({
            reloading: true
        })

        this.props.api.post("application/website/details", { trackingCode: this.props.match.params.id })
            .then(res => {
                let data = [];
                let dataPaths = [];

                res.data.hourly.map(hour => {
                    data.push({
                        timestamp: hour.timestamp,
                        formattedTooltip: this.formatTooltip(new Date(hour.timestamp)),
                        key: "Visits",
                        value: hour.visits
                    })

                    data.push({
                        timestamp: hour.timestamp,
                        formattedTooltip: this.formatTooltip(new Date(hour.timestamp)),
                        key: "Views",
                        value: hour.pageViews
                    })

                    return "";
                })

                let tempPaths = {};
                let tempPathsArray = [];

                res.data.hourlyPaths.map(hour => {
                    if(!tempPaths[hour.path]) {
                        tempPaths[hour.path] = {
                            path: hour.path,
                            visits: hour.visits,
                            views: hour.pageViews
                        }
                    } else {
                        tempPaths[hour.path].visits += hour.visits;
                        tempPaths[hour.path].views += hour.pageViews;
                    }

                    return "";
                })

                for(let path in tempPaths) {
                    tempPathsArray.push(tempPaths[path]);
                }

                tempPathsArray = tempPathsArray.sort((a, b) => {
                    return b.views - a.views
                })

                tempPathsArray = tempPathsArray.slice(0, 10)

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

                    return "";
                })

                this.setState({
                    hourly: data,
                    hourlyPaths: dataPaths,
                    name: res.data.name,
                    loading: false,
                    reloading: false,
                    fullData: res.data.hourly,
                    lastMonthViews: lastMonthViews,
                    lastMonthVisits: lastMonthVisits,
                    hourlyPathsTable: tempPathsArray
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

        const activeWebsiteColumns = [
            {
                title: 'Path',
                dataIndex: 'path',
                key: 'path'
            },
            {
                title: 'Visitors',
                dataIndex: 'visits',
                key: 'visits',
            },
            {
                title: 'Views',
                dataIndex: 'views',
                key: 'views',
            }
        ]

        let data = this.state.hourly;

        const configHourlyData = {
            data,
            height: 400,
            xField: 'timestamp',
            yField: 'value',
            point: {
                size: 5,
                shape: 'diamond',
            },
            seriesField: 'key',
            isGroup: true,
            legend: false,
            xAxis: {
                label: {
                    formatter: (name) => {
                        return this.formatDate(new Date(name))
                    }
                }
            },
            tooltip: {
                title: "formattedTooltip",
            }
        }

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
            </Col>

            <Col style={{marginTop: 25}} span={24}>
                <Column {...configHourlyData} />
            </Col>

            <Col span={24}>
                <Divider/>
            </Col>

            { this.state.hourlyPathsTable.length <= 1 ? "" : (
                <Col span={12}>
                    <Title level={3}>Top { this.state.hourlyPathsTable.length } paths</Title>
                    <Table dataSource={this.state.hourlyPathsTable} columns={activeWebsiteColumns} />
                </Col>) }

            { this.state.hourlyPathsTable.length <= 1 ? "" : (
                <Col span={12}>
                    <Title level={3}>Top { this.state.hourlyPathsTable.length } browsers</Title>
                    <Table dataSource={this.state.hourlyPathsTable} columns={activeWebsiteColumns} />
                </Col>) }
        </Row>;
    }
}

export default Website