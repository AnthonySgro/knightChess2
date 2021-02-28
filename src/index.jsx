import React, { Component } from "react";
import ReactDom from "react-dom";
import ChessApp from "./components/chessApp.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

class GamePage extends Component {
    render() {
        return <ChessApp />;
    }
}

ReactDom.render(
    <DndProvider backend={HTML5Backend}>
        <GamePage />
    </DndProvider>,
    document.querySelector("#app"),
);
