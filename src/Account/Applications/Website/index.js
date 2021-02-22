import React from "react";
import {Col, Divider, Row, Skeleton, Table, Radio} from "antd";
import Title from "antd/lib/typography/Title";
import Line from "@ant-design/charts/lib/line";
import Column from "@ant-design/charts/lib/column";
import Header from "./Header"
import Statistics from "./Statistics";

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

        this.loadedEnough = false;
    }

    dateToFormatted = (d) => {
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        const hour = ("0" + d.getHours()).slice(-2);

        return `${year}-${month}-${day}T${hour}:00:00`;
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

        this.props.api.post("application/website/details", { trackingCode: this.props.match.params.id, range: range ? range : this.state.dataRange })
            .then(res => {
                let data = [];
                let dataPaths = [];

                res.data.hourly.map(hour => {
                    data.push({
                        timestamp: this.dateToFormatted(new Date(hour[0])),
                        formattedTooltip: this.formatTooltip(new Date(hour[0])),
                        key: "Visits",
                        value: hour[1]
                    })

                    data.push({
                        timestamp: this.dateToFormatted(new Date(hour[0])),
                        formattedTooltip: this.formatTooltip(new Date(hour[0])),
                        key: "Views",
                        value: hour[2]
                    })

                    return "";
                })

                let tempPaths = {};
                let tempPathsArray = [];

                res.data.hourlyPaths.map(hour => {
                    if(!tempPaths[hour[3]]) {
                        tempPaths[hour[3]] = {
                            path: hour[3],
                            visits: hour[1],
                            views: hour[2]
                        }
                    } else {
                        tempPaths[hour[3]].visits += hour[1];
                        tempPaths[hour[3]].views += hour[2];
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
                    if(!tempBrowsers[hour[3]]) {
                        tempBrowsers[hour[3]] = {
                            browser: hour[3],
                            visits: hour[1],
                            views: hour[2]
                        }
                    } else {
                        tempBrowsers[hour[3]][1] += hour[1];
                        tempBrowsers[hour[3]][2] += hour[2];
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

                let addInBetween = []
                let tempData = data.filter((i) => {
                    return i.key === "Visits";
                })

                for(let i = 0; i < tempData.length; i++) {
                    const shouldBeNext = new Date(tempData[i].timestamp);
                    const isN = new Date(tempData[i].timestamp);
                    shouldBeNext.setHours(isN.getHours() + 1);

                    if(tempData[i + 1] && new Date(tempData[i + 1].timestamp).getTime() !== shouldBeNext.getTime()) {
                        // Done
                        if(shouldBeNext > new Date())
                            break;

                        const differenceInHours = (new Date(tempData[i + 1].timestamp) - new Date(tempData[i].timestamp)) / (60 * 60 * 1000);

                        for(let time = 0; time < differenceInHours; time++) {
                            const tempDate = new Date(tempData[i].timestamp);
                            const timestampToAdd = new Date(tempData[i].timestamp);
                            timestampToAdd.setHours(tempDate.getHours() + time);

                            addInBetween.push({
                                timestamp: this.dateToFormatted(timestampToAdd),
                                formattedTooltip: this.formatTooltip(timestampToAdd),
                                key: "Visits",
                                value: 0
                            })

                            addInBetween.push({
                                timestamp: this.dateToFormatted(timestampToAdd),
                                formattedTooltip: this.formatTooltip(timestampToAdd),
                                key: "Views",
                                value: 0
                            })
                        }
                    }
                }

                data.push(...addInBetween)

                data.sort((a, b) => {
                    return a.timestamp > b.timestamp ? 1 : 0
                })

                res.data.hourly.sort((a, b) => {
                    return a.timestamp > b.timestamp ? 1 : 0
                })

                let lastMonthViews = 0;
                let lastMonthVisits = 0;

                res.data.hourly.map(h => {
                    lastMonthViews += h[2]
                    lastMonthVisits += h[1]

                    return "";
                })

                let otherData = false;
                if(data.length > 720) {
                    otherData = []
                    let otherTempData = {}

                    for(let d of data) {
                        if(!otherTempData[this.formatDate(new Date(d.timestamp))]) {
                            otherTempData[this.formatDate(new Date(d.timestamp))] = [{
                                timestamp: d.timestamp,
                                formattedTooltip: this.formatTooltip(new Date(d.timestamp)),
                                key: d.key,
                                value: d.value
                            }]
                        } else {
                            if(!otherTempData[this.formatDate(new Date(d.timestamp))][1])
                                otherTempData[this.formatDate(new Date(d.timestamp))].push({
                                    timestamp: d.timestamp,
                                    formattedTooltip: this.formatTooltip(new Date(d.timestamp)),
                                    key: d.key,
                                    value: d.value
                                })

                            if(d.key === otherTempData[this.formatDate(new Date(d.timestamp))][0].key)
                                otherTempData[this.formatDate(new Date(d.timestamp))][0].value += d.value;
                            if(d.key === otherTempData[this.formatDate(new Date(d.timestamp))][1].key)
                                otherTempData[this.formatDate(new Date(d.timestamp))][1].value += d.value;
                        }
                    }

                    for(let d in otherTempData) {
                        otherData.push(otherTempData[d][0]);
                        otherData.push(otherTempData[d][1]);
                    }
                }

                this.setState({
                    hourly: otherData ? otherData : data,
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
            this.loadedEnough = false;
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

        if(!this.loadedEnough && this.state.hourly.length <= 24) {
            return <div>
                <Title style={{color: this.props.darkmode ? "white" : "black"}}>{ this.state.name }</Title>
                <p>Currently we have not gathered enough information about this application, please check back later.</p>
                <p>Gathered { this.state.hourly.length } out of 25 entries needed </p>
            </div>
        }

        this.loadedEnough = true;

        return <Row gutter={8}>
            <Col span={24}>
                <Header darkmode={this.props.darkmode} setDataRange={(range) => {
                    this.setDataRange(range);
                }} reloading={this.state.reloading} name={this.state.name} reloadWebsite={() => {
                    this.reloadWebsite();
                }} />
            </Col>

            <Col span={24}>
                <Statistics darkmode={this.props.darkmode} range={this.state.dataRange}  fullData={this.state.fullData} lastMonthVisits={this.state.lastMonthVisits} lastMonthViews={this.state.lastMonthViews} />
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
                    <Title style={{color: this.props.darkmode ? "white" : "black"}} level={3}>Top { this.state.hourlyPathsTable.length } paths</Title>
                    <Table className={this.props.darkmode ? "darkmode" : null} dataSource={this.state.hourlyPathsTable} columns={activeWebsiteColumns} pagination={false} />
                </Col>) }

            { this.state.hourlyBrowsersTable.length <= 0 ? "" : (
                <Col span={12}>
                    <Title style={{color: this.props.darkmode ? "white" : "black"}} level={3}>Top { this.state.hourlyBrowsersTable.length } browsers</Title>
                    <Table className={this.props.darkmode ? "darkmode" : null} dataSource={this.state.hourlyBrowsersTable} columns={browserColumns} pagination={false} />
                </Col>) }
        </Row>;
    }
}

export default Website