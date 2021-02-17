import React from 'react';
import {Button, Row, Card, Col, Drawer, Skeleton, Statistic, Divider} from "antd";
import Title from "antd/es/typography/Title";
import {ReloadOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

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
            reloading: false,

            copied: false
        }

        this.trackingRef = React.createRef();
    }

    reloadOverview() {
        this.setState({
            reloading: true
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
                    trackingSnippet: res.data.trackingSnippet,
                    reloading: false
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.reload !== prevProps.reload) {
            this.setState({
                loading: true
            })

            this.reloadOverview();
        }
    }

    selectText(){
        var sel, range;
        var el = document.querySelector("code"); //get element id
        if (window.getSelection && document.createRange) { //Browser compatibility
            sel = window.getSelection();
            if(sel.toString() === ''){ //no text selection
                window.setTimeout(function(){
                    range = document.createRange(); //range object
                    range.selectNodeContents(el); //sets Range
                    sel.removeAllRanges(); //remove all ranges from selection
                    sel.addRange(range);//add Range to a Selection.
                },1);
            }
        }else if (document.selection) { //older ie
            sel = document.selection.createRange();
            if(sel.text === ''){ //no text selection
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
            content = <Row style={{background: this.props.darkmode ? "#222222" : null, color: this.props.darkmode ? "white" : "black"}} gutter={8}>
                <Col span={24}>
                    <span style={{ fontWeight: "bold", fontSize: "2.3em" }}> {this.state.name }</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;<a href={this.state.address} rel={"noreferrer"} target={"_blank"}>{ this.state.address }</a> </span>

                    <Divider/>
                </Col>

                <Col span={24}>
                    <Row>
                        <Col span={12}>
                            <Title style={{color: this.props.darkmode ? "white" : "black"}} level={3}>Quick Overview</Title>
                        </Col>
                        <Col span={12} style={{textAlign: "right"}}>
                            <Link to={"/applications/website/" + this.props.code }><Button type={"primary"} style={{marginRight: 10}}>More Details</Button></Link>
                            <Button onClick={() => {this.reloadOverview()}} loading={ this.state.reloading } icon={ <ReloadOutlined/> }>Reload</Button>
                        </Col>
                    </Row>
                    <Title style={{color: this.props.darkmode ? "white" : "black"}} level={4}>Past Hour</Title>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Card className={this.props.darkmode ? "darkmode" : null}>
                                <Statistic
                                    title={<span style={{color: "white"}}>Visitors</span>}
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
                    <Title style={{color: this.props.darkmode ? "white" : "black"}} level={4}>30 Days</Title>

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
                            <Title style={{color: this.props.darkmode ? "white" : "black"}} level={3}>Tracking Code</Title>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <Button onClick={() => {
                                this.copyTrackingCode();
                            }}> Select </Button>
                        </Col>
                    </Row>

                    <pre><code ref={this.trackingRef}>
                        { this.state.trackingSnippet }
                    </code></pre>
                </Col>

            </Row>
        }

        return <Drawer
            title="Website Details"
            className={"darkmode"}
            width={720}
            onClose={this.props.close}
            visible={this.props.visible}
            bodyStyle={{ paddingBottom: 80, background: this.props.darkmode ? "#303030" : null, color: this.props.darkmode ? "white" : "black" }}
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