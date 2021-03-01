import React, { Component } from "react";
import TileFilter from "../tileFilter/tileFilter.jsx";

class Row extends Component {
    renderTileFilter(col, rowColorInit) {
        return (
            <TileFilter
                //board configuration
                boardConfig={this.props.boardConfig}
                tileConfig={this.props.rowConfig[col]}
                row={this.props.row}
                col={col}
                //player turn
                playerTurn={this.props.playerTurn}
                //color seed info
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
            //renders 8 tiles per row, alternating rowStartColor
            <div className="row">
                {this.renderTileFilter(0, this.props.rowStartColor)}
                {this.renderTileFilter(1, !this.props.rowStartColor)}
                {this.renderTileFilter(2, this.props.rowStartColor)}
                {this.renderTileFilter(3, !this.props.rowStartColor)}
                {this.renderTileFilter(4, this.props.rowStartColor)}
                {this.renderTileFilter(5, !this.props.rowStartColor)}
                {this.renderTileFilter(6, this.props.rowStartColor)}
                {this.renderTileFilter(7, !this.props.rowStartColor)}
            </div>
        );
    }
}

export default Row;
