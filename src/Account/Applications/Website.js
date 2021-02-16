import React from "react";
import {Button, Card, Col, Divider, Row, Skeleton, Statistic, Table, Radio, DatePicker} from "antd";
import Title from "antd/lib/typography/Title";
import {ReloadOutlined} from "@ant-design/icons";
import Line from "@ant-design/charts/lib/line";
import Column from "@ant-design/charts/lib/column";
import moment from 'moment';

const { RangePicker } = DatePicker

class Website extends React.Component {
    hourlyBrowsers;
    pageViews;

    constructor(props) {
        super(props);

        this.state = {
            hourly: [],
            hourlyPaths: [],
            hourlyPathsTable: [],
            hourlyBrowsersTable: [],
            fullData: [],
            name: "",
            loading: true,
            reloading: false,
            lastMonthVisits: 0,
            lastMonthViews: 0,
            previousMonthVisitors: 0,
            previousMonthViews: 0,
            chartType: "Line",
            dataRange: []
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

    reloadWebsite(range) {
        this.setState({
            reloading: true
        })

        console.log(range ? range : this.state.dataRange)

        this.props.api.post("application/website/details", { trackingCode: this.props.match.params.id, range: range ? range : this.state.dataRange })
            .then(res => {
                let data = [];
                let dataPaths = [];

                res.data.hourly.map(hour => {
                    data.push({
                        timestamp: hour.timestamp,
                        label: "test",
                        formattedTooltip: this.formatTooltip(new Date(hour.timestamp)),
                        key: "Visits",
                        value: hour.visits
                    })

                    data.push({
                        timestamp: hour.timestamp,
                        label: "test",
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

                let tempBrowsers = {};
                let tempBrowsersArray = [];

                res.data.hourlyBrowsers.map(hour => {
                    if(!tempBrowsers[hour.browser]) {
                        tempBrowsers[hour.browser] = {
                            browser: hour.browser,
                            visits: hour.visits,
                            views: hour.pageViews
                        }
                    } else {
                        tempBrowsers[hour.browser].visits += hour.visits;
                        tempBrowsers[hour.browser].views += hour.pageViews;
                    }

                    return "";
                })

                for(let path in tempBrowsers) {
                    tempBrowsersArray.push(tempBrowsers[path]);
                }

                tempBrowsersArray = tempBrowsersArray.sort((a, b) => {
                    return b.views - a.views
                })

                tempBrowsersArray = tempBrowsersArray.slice(0, 10)

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
                    hourlyPathsTable: tempPathsArray,
                    hourlyBrowsersTable: tempBrowsersArray
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

    setChartType(t) {
        this.setState({
            chartType: t.target.value
        })
    }

    setDataRange(range) {
        this.setState({
            dataRange: [range[0].valueOf(), range[1].valueOf()]
        })

        this.reloadWebsite([range[0].valueOf(), range[1].valueOf()]);
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

        const browserColumns = [
            {
                title: 'Browser',
                dataIndex: 'browser',
                key: 'browser'
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
            seriesField: 'key',
            isGroup: true,
            legend: false,
            animate: false,
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
                    <Col span={12}>
                        <Title>{ this.state.name }</Title>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <RangePicker onChange={(date) => {
                            this.setDataRange(date);
                        }} ranges={{
                            Today: [moment().startOf("day"), moment()],
                            'Last Week': [moment().add(-7, 'days'), moment()],
                            'This Week': [moment().startOf("week"), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last 30 days': [moment().add(-30, 'days'), moment()],
                            'Last Year': [moment().add(-365, 'days'), moment()],
                            'All Time': [moment("1970-1-1"), moment()],
                        }}  defaultValue={[moment().add(-30, 'days'), moment()]} format="YYYY-MM-DD"/>
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

            <Col span={24} style={{marginTop: 25, width: 300}} >
                <Radio.Group options={["Line", "Bar"]} onChange={(t) => {
                    this.setChartType(t)
                }} value={this.state.chartType} buttonStyle={"solid"} optionType="button" />
            </Col>

            <Col span={24} style={{marginTop: 25}} >
                { this.state.chartType === "Line" ? <Line {...configHourlyData} /> : <Column {...configHourlyData} /> }
            </Col>

            <Col span={24}>
                <Divider/>
            </Col>

            { this.state.hourlyPathsTable.length <= 1 ? "" : (
                <Col span={12}>
                    <Title level={3}>Top { this.state.hourlyPathsTable.length } paths</Title>
                    <Table dataSource={this.state.hourlyPathsTable} columns={activeWebsiteColumns} />
                </Col>) }

            { this.state.hourlyBrowsersTable.length <= 0 ? "" : (
                <Col span={12}>
                    <Title level={3}>Top { this.state.hourlyBrowsersTable.length } browsers</Title>
                    <Table dataSource={this.state.hourlyBrowsersTable} columns={browserColumns} />
                </Col>) }
        </Row>;
    }
}

export default Website