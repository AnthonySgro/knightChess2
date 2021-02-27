import React, { Component } from "react";
import ReactDom from "react-dom";
import ChessApp from "./components/chessApp.jsx";

class GamePage extends Component {
    render() {
        return <ChessApp />;
    }
}

ReactDom.render(<GamePage />, document.querySelector("#app"));
