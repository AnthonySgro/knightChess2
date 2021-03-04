import React, { Component } from "react";

class UserInterface extends Component {
    render() {
        const { turn, history } = this.props;
        const turnInfo = turn ? "White's Turn" : "Black's Turn";
        return (
            <div id="user-interface">
                <button
                    className="greenbtn"
                    id="init-game"
                    onClick={() => this.props.setUpBoard()}
                >
                    Swap Side
                </button>
                <div id="phase-information">Selecting Phase</div>
                <div id="turn-information">{turnInfo}</div>
                <button
                    className="redbtn"
                    id="back"
                    onClick={() => this.props.moveBack(event)}
                >
                    &lt;
                </button>
                <button
                    className="redbtn"
                    id="forward"
                    onClick={() => this.props.moveForward(event)}
                >
                    &gt;
                </button>
                <div className="user-feedback"></div>
            </div>
        );
    }
}

export default UserInterface;
