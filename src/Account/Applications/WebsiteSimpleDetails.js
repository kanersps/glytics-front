import React from 'react';
import {Button, Row, Card, Col, Drawer, Skeleton, Statistic, PageHeader, Divider} from "antd";
import Title from "antd/es/typography/Title";
import Highlight from "react-highlight.js"
import {CheckOutlined} from "@ant-design/icons";

class WebsiteSimpleDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            address: "",
            name: "",
            trackingSnippet: "",
            lastHourVisitors: 0,
            lastHourViews: 0,
            lastMonthVisitors: 0,
            lastMonthViews: 0,

            copied: false
        }

        this.trackingRef = React.createRef();
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.reload !== prevProps.reload) {
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
                        lastHourViews: res.data.lastHourViews,
                        lastHourVisitors: res.data.lastHourVisitors,
                        lastMonthViews: res.data.lastMonthViews,
                        lastMonthVisitors: res.data.lastMonthVisitors,
                        trackingSnippet: res.data.trackingSnippet
                    })
                })
        }
    }

    selectText(){
        var sel, range;
        var el = document.querySelector("code"); //get element id
        if (window.getSelection && document.createRange) { //Browser compatibility
            sel = window.getSelection();
            if(sel.toString() == ''){ //no text selection
                window.setTimeout(function(){
                    range = document.createRange(); //range object
                    range.selectNodeContents(el); //sets Range
                    sel.removeAllRanges(); //remove all ranges from selection
                    sel.addRange(range);//add Range to a Selection.
                },1);
            }
        }else if (document.selection) { //older ie
            sel = document.selection.createRange();
            if(sel.text == ''){ //no text selection
                range = document.body.createTextRange();//Creates TextRange object
                range.moveToElementText(el);//sets Range
                range.select(); //make selection.
            }
        }
    }

    copyTrackingCode() {
        this.selectText();
    }

    render () {
        let content = <Skeleton paragraph={{ rows: 10 }} />

        if (!this.state.loading) {
            content = <Row gutter={8}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/default.min.css" />

                <Col span={24}>
                    <span style={{ fontWeight: "bold", fontSize: "2.3em" }}> {this.state.name }</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;<a href={this.state.address} target={"_blank"}>{ this.state.address }</a> </span>

                    <Divider/>
                </Col>

                <Col span={24}>
                    <Title level={3}>Quick Overview</Title>
                    <Title level={4}>Past Hour</Title>

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

                <Col span={24} style={{marginTop: 20}}>
                    <Title level={4}>30 Days</Title>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Visitors"
                                    value={ this.state.lastMonthVisitors }
                                    precision={0}
                                    suffix=" people"
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Views"
                                    value={ this.state.lastMonthViews }
                                    precision={0}
                                    suffix=" pages"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Divider/>

                <Col span={24}>
                    <Row>
                        <Col span={20}>
                            <Title level={3}>Tracking Code</Title>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <Button onClick={() => {
                                this.copyTrackingCode();
                            }}> Select </Button>
                        </Col>
                    </Row>

                    <Highlight ref={this.trackingRef} language={"html"}>
                        { this.state.trackingSnippet }
                    </Highlight>
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
                    <Button onClick={this.props.close} style={{ marginRight: 8 }}>
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