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
                //player turn
                playerTurn={this.props.playerTurn}
                //row color seeder
                rowStartColor={rowColorInit}
                //tiles involved in last move
                lastMoveSquares={this.props.lastMoveSquares}
                //dragging/moving functions
                onMove={this.props.onMove}
                onDragStart={this.props.onDragStart}
                //rotate
                rotation={this.props.rotation}
            />
        );
    }

    render() {
        const { rotation } = this.props;
        return (
            <div
                id="chessboard-backdrop"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
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
