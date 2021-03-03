import {Card, Col, Row, Spin, Statistic} from "antd";
import React from "react";
import Moment from "moment"


class Statistics extends React.Component {
    constructor(props) {
        super(props);


        this.state = { statisticTitleTimeframe: "between " + (Moment().add(-30, "days").format("DD-MM-YYYY")) + "—" + Moment().format("DD-MM-YYYY") };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.range !== this.props.range) {
            const From = Moment(this.props.range[0]).format("DD-MM-YYYY")
            const Till = Moment(this.props.range[1]).format("DD-MM-YYYY")

            if(From === Till) {
                this.setState({
                    statisticTitleTimeframe: `on ${Till}`
                })
            } else {
                this.setState({
                    statisticTitleTimeframe: `between ${From}—${Till}`
                })
            }
        }
    }

    roundToHour(date) {
        const p = 60 * 60 * 1000; // milliseconds in an hour
        return new Date(Math.round(Math.floor(date.getTime() / p )) * p);
    }

    render() {
        return <Row style={{background: this.props.darkmode ? "#222222" : null, color: this.props.darkmode ? "white" : "black"}} gutter={16}>
            <Col span={6}>
                <Spin spinning={this.props.reloading}>
                    <Card className={this.props.darkmode ? "darkmode" : null}>
                        <Statistic
                            title="Visitors in the last hour"
                            value={ this.props.fullData.length === 0 ? 0 : this.props.fullData[this.props.fullData.length - 1][1] }
                            precision={0}
                            suffix={this.props.fullData.length === 0 ? " people" : (this.props.fullData[this.props.fullData.length - 1][1] > 1 ? " people" : " person")}
                        />
                    </Card>
                </Spin>
            </Col>

            <Col span={6}>
                <Spin spinning={this.props.reloading}>
                    <Card className={this.props.darkmode ? "darkmode" : null}>
                        <Statistic
                            title="Views in the last hour"
                            value={ this.props.fullData.length === 0 ? 0 : this.props.fullData[this.props.fullData.length - 1][2] }
                            precision={0}
                            suffix={this.props.fullData.length === 0 ? " pages" : (this.props.fullData[this.props.fullData.length - 1][2] > 1 ? " pages" : " page")}
                        />
                    </Card>
                </Spin>
            </Col>

            <Col span={6}>
                <Spin spinning={this.props.reloading}>
                    <Card className={this.props.darkmode ? "darkmode" : null}>
                        <Statistic
                            title={"Visitors " + this.state.statisticTitleTimeframe}
                            value={ this.props.lastMonthVisits }
                            precision={0}
                            suffix={ this.props.lastMonthVisits > 1 ? " people" : " person"}
                        />
                    </Card>
                </Spin>
            </Col>

            <Col span={6}>
                <Spin spinning={this.props.reloading}>
                    <Card className={this.props.darkmode ? "darkmode" : null}>
                        <Statistic
                            title={"Views " + this.state.statisticTitleTimeframe}
                            value={ this.props.lastMonthViews }
                            precision={0}
                            suffix={ this.props.lastMonthViews > 1 ? " pages" : " page"}
                        />
                    </Card>
                </Spin>
            </Col>
        </Row>
    }
}

export default Statistics