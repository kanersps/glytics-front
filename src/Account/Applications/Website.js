import React from "react";
import {Button, Card, Col, Divider, Row, Skeleton, Statistic, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {ReloadOutlined} from "@ant-design/icons";
import {Line} from "@ant-design/charts";

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
                let dataPaths = [];
                let hourlyPathsTableTemp = []

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

                    return "";
                })

                let thisHour = new Date();

                let pathsThisHour = []

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
                })

                for(let path in tempPaths) {
                    tempPathsArray.push(tempPaths[path]);
                }

                tempPathsArray = tempPathsArray.sort((a, b) => {
                    return a.visitors < b.visitors ? 1 : -1;
                })

                res.data.hourlyPaths.map(hour => {
                    if(hour.timestamp !== thisHour) {
                        // Sort and add all to dataPaths

                        pathsThisHour = pathsThisHour.sort((a, b) => {
                            return a.timestamp < b.timestamp ? 1 : -1;
                        }).slice(0, 10)

                        dataPaths.push(...pathsThisHour);

                        pathsThisHour = []
                    }

                    thisHour = hour.timestamp

                    pathsThisHour.push({
                        timestamp: this.formatDate(new Date(hour.timestamp)),
                        type: "visit",
                        path: hour.path,
                        key: "Visits for " + hour.path,
                        value: hour.visits
                    })

                    pathsThisHour.push({
                        timestamp: this.formatDate(new Date(hour.timestamp)),
                        type: "view",
                        path: hour.path,
                        key: "Views for " + hour.path,
                        value: hour.pageViews
                    })

                    return "";
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
            height: 300,
            xField: 'timestamp',
            yField: 'value',
            point: {
                size: 5,
                shape: 'diamond',
            },
            seriesField: 'key',
        };

        const configHourlyDataPath = {
            data: this.state.hourlyPaths,
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

            <Col span={12}>
                <Title level={3}>Hourly Visitors</Title>
            </Col>
            <Col span={12}>
                <Title level={3}>Hourly Paths</Title>
            </Col>

            <Col span={11}>
                <Line {...configHourlyData} />
            </Col>

            <Col span={1}></Col>

            <Col span={11}>
                <Line {...configHourlyDataPath} />
            </Col>

            { this.state.hourlyPathsTable.length <= 1 ? "" : (
                <Col span={24}>
                    <Divider/>
                    <Title level={3}>Top { this.state.hourlyPathsTable.length } paths</Title>
                    <Table dataSource={this.state.hourlyPathsTable} columns={activeWebsiteColumns} />
                </Col>) }
        </Row>;
    }
}

export default Website