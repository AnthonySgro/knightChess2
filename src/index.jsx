import React, { Component } from "react";
import ReactDom from "react-dom";

class Main extends Component {
    render() {
        return <div>hi</div>;
    }
}

ReactDom.render(<Main />, document.querySelector("#app"));
