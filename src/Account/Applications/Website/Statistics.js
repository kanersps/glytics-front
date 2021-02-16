import {Card, Col, Row, Statistic} from "antd";
import React from "react";

class Statistics extends React.Component {
    render() {
        return <Row gutter={16}>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Visitors in the last hour"
                        value={ this.props.fullData.length === 0 ? 0 : this.props.fullData[this.props.fullData.length - 1].visits }
                        precision={0}
                        suffix={this.props.fullData.length === 0 ? " people" : (this.props.fullData[this.props.fullData.length - 1].visits > 1 ? " people" : " person")}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Views in the last hour"
                        value={ this.props.fullData.length === 0 ? 0 : this.props.fullData[this.props.fullData.length - 1].pageViews }
                        precision={0}
                        suffix={this.props.fullData.length === 0 ? " pages" : (this.props.fullData[this.props.fullData.length - 1].pageViews > 1 ? " pages" : " page")}
                    />
                </Card>
            </Col>

            <Col span={6}>
                <Card>
                    <Statistic
                        title="Visitors in the last month"
                        value={ this.props.lastMonthVisits }
                        precision={0}
                        suffix={ this.props.lastMonthVisits > 1 ? " people" : " person"}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Views in the last month"
                        value={ this.props.lastMonthViews }
                        precision={0}
                        suffix={ this.props.lastMonthViews > 1 ? " pages" : " page"}
                    />
                </Card>
            </Col>
        </Row>
    }
}

export default Statistics