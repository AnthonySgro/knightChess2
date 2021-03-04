import React, { Component } from "react";

class UserInterface extends Component {
    constructor() {
        super();
    }
    render() {
        const { turn, history } = this.props;
        const turnInfo = turn ? "White's Turn" : "Black's Turn";
        return (
            <div id="user-interface">
                <div id="ui-row-1">
                    <div className="row-1-element">
                        <button
                            className="redbtn"
                            id="init-game"
                            onClick={() => this.props.rotateBoard()}
                        >
                            Flip Board
                        </button>
                    </div>
                    <div className="row-1-element">
                        <div id="phase-information">Username</div>
                    </div>
                    <div className="row-1-element">
                        <div id="turn-information">{turnInfo}</div>
                    </div>
                    <div className="row-1-element">
                        <button
                            className="redbtn history-btn"
                            id="back"
                            onClick={() => this.props.moveBack(event)}
                        >
                            &lt;
                        </button>
                        <button
                            className="redbtn history-btn"
                            id="forward"
                            onClick={() => this.props.moveForward(event)}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
                <div id="ui-row-2">
                    {/* placeholder element */}
                    <div className="row-2-element">
                        <button
                            id="rules-btn"
                            className="greenbtn"
                            onClick={() => this.props.openRules(event)}
                        >
                            Show Chat
                        </button>{" "}
                    </div>
                    <div className="row-2-element">
                        <div
                            className="user-feedback second-row-fdbck"
                            id="user-feedback"
                        ></div>
                    </div>
                    <div className="row-2-element">
                        <button
                            id="newGame-btn"
                            className="btn greenBtn second-row-fdbck"
                            style={{ visibility: "hidden" }}
                            onClick={() => this.props.newGame(event)}
                        >
                            New Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserInterface;
