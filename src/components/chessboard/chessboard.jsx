import React, { Component } from "react";
import Row from "../row/row.jsx";

class Chessboard extends Component {
    //the chessboard will render our rows
    renderRow(row, rowColorInit) {
        return (
            //row properties
            <Row
                //board configuration info
                boardConfig={this.props.boardConfig}
                rowConfig={this.props.boardConfig[row]}
                row={7 - row}
                //state
                playerTurn={this.props.playerTurn}
                //row color seeder
                rowStartColor={rowColorInit}
                //tiles involved in last move
                lastMoveSquares={this.props.lastMoveSquares}
                //dragging/moving functions
                onMove={this.props.onMove}
                onDragEnter={this.props.onDragEnter}
                onDragLeave={this.props.onDragLeave}
                onDragStart={this.props.onDragStart}
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
