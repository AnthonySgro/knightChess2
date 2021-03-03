import React, { Component } from "react";
import ReactDom from "react-dom";
import ChessApp from "./components/chessApp.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Sidebar from "./components/sidebar/sidebar.jsx";
import History from "./components/history/history.jsx";

class GamePage extends Component {
    constructor() {
        super();
        this.openRules = this.openRules.bind(this);
        this.closeRules = this.openRules.bind(this);
    }
    openRules() {
        const rulesTab = document.querySelector("#rules");
        rulesTab.classList.add("show");
    }

    render() {
        return (
            <React.Fragment>
                <button
                    id="rules-btn"
                    className="btn greenbtn"
                    onClick={() => this.openRules(event)}
                >
                    Show Rules
                </button>
                <Sidebar closeRules={this.closeRules} />
                <ChessApp />
            </React.Fragment>
        );
    }
}

ReactDom.render(
    <DndProvider backend={HTML5Backend}>
        <GamePage />
    </DndProvider>,
    document.querySelector("#app"),
);
