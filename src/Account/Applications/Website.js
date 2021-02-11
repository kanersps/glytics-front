import React from "react";

class Website extends React.Component {
    render() {
        return <div>
            { this.props.match.params.id }
        </div>
    }
}

export default Website