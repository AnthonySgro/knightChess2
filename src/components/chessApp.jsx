import React, { Component } from "react";
import Chessboard from "./chessboard/chessboard.jsx";
import UserInterface from "./ui/userInterface.jsx";

class ChessApp extends Component {
    constructor() {
        super();
        this.state = {
            //tracks the board configuration over time
            history: [
                {
                    //this is our board representation
                    //**CHANGING THIS WILL CHANGE THE OUTPUT**
                    boardConfig: [
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                    ],
                },
            ],
            //initializes game to move 0 and white-to-move
            stepNumber: 0,
            whiteIsNext: true,
            whitePieces: [],
            blackPieces: [],
            allPieces: [],
        };
    }

    componentDidMount() {}

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        //displays whatever we set 'current' to

        return (
            <div id="chess-app">
                <div id="interface-container">
                    <Chessboard boardConfig={current.boardConfig} />
                    <UserInterface />
                </div>
            </div>
        );
    }
}

export default ChessApp;
