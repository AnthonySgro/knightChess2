import React, { Component } from "react";

class History extends Component {
    render() {
        return (
            <div id="history-box">
                <div id="clocks">
                    <div id="placeholder"></div>
                    <div className="clock" id="opp-player-clock">
                        10:00
                    </div>
                    <div className="clock" id="cur-player-clock">
                        11:00
                    </div>
                </div>
                <div id="history">
                    <div id="moves">
                        <div className="moveNum">1</div>
                        <div className="moveNum">2</div>
                        <div className="moveNum">3</div>
                    </div>
                    <div id="white-history">
                        <div className="whiteMove move">1</div>
                        <div className="whiteMove move">2</div>
                        <div className="whiteMove move">3</div>
                    </div>
                    <div id="black-history">
                        <div className="whiteMove move">1</div>
                        <div className="whiteMove move">2</div>
                        <div className="whiteMove move">3</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default History;
