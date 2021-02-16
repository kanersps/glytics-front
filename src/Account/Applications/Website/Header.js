import React from "react";
import {Button, Col, Row, DatePicker} from "antd";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import {ReloadOutlined} from "@ant-design/icons";

const { RangePicker } = DatePicker;

class Header extends React.Component {
    render() {
        return <Row>
            <Col span={12}>
                <Title>{ this.props.name }</Title>
            </Col>
            <Col span={12} style={{textAlign: "right"}}>
                <RangePicker onChange={(date) => {
                    this.props.setDataRange(date);
                }} ranges={{
                    Today: [moment().startOf("day"), moment()],
                    'Last Week': [moment().add(-7, 'days'), moment()],
                    'This Week': [moment().startOf("week"), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last 30 days': [moment().add(-30, 'days'), moment()],
                    'Last Year': [moment().add(-365, 'days'), moment()],
                    'All Time': [moment("1970-1-1"), moment()],
                }}  defaultValue={[moment().add(-30, 'days'), moment()]} format="YYYY-MM-DD"/>
                <Button onClick={() => {this.props.reloadWebsite()}} loading={ this.props.reloading } icon={ <ReloadOutlined/> }>Reload</Button>
            </Col>
        </Row>
    }
}

export default Header