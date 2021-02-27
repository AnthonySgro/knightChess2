import React, { Component } from "react";
import Row from "../row/row.jsx";

class Chessboard extends Component {
    //the chessboard will render our rows
    renderRow(row, rowColorInit) {
        return (
            //row properties
            <Row
                rowConfig={this.props.boardConfig[row]}
                row={7 - row}
                rowStartColor={rowColorInit}
            />
        );
    }

    render() {
        return (
            <div id="chessboard-backdrop">
                {this.renderRow(0, true)}
                {this.renderRow(1, false)}
                {this.renderRow(2, true)}
                {this.renderRow(3, false)}
                {this.renderRow(4, true)}
                {this.renderRow(5, false)}
                {this.renderRow(6, true)}
                {this.renderRow(7, false)}
            </div>
        );
    }
}

export default Chessboard;
