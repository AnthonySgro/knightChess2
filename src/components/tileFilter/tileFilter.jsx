import React, { Component } from "react";
import Tile from "../tile/tile.jsx";
import notationConverter from "../../helper-functions/notationConverter";

class TileFilter extends Component {
    constructor(props) {
        super(props);
        this.numberCoords = [props.col, props.row];
        this.chessCoords = notationConverter(this.numberCoords);
    }

    render() {
        //props
        const { tileConfig, row, col, rowStartColor } = this.props;

        //determines id
        const id = this.chessCoords.join("") + "-filter";

        //to render
        return (
            <div id={id} className="default-filter">
                <Tile
                    //board configuration
                    boardConfig={this.props.boardConfig}
                    tileConfig={tileConfig}
                    row={row}
                    col={col}
                    //player turn
                    playerTurn={this.props.playerTurn}
                    //color seeding
                    rowStartColor={rowStartColor}
                    //tiles involved in last move
                    lastMoveSquares={this.props.lastMoveSquares}
                    //dragging/moving functions
                    onMove={this.props.onMove}
                    onDragEnter={this.props.onDragEnter}
                    onDragLeave={this.props.onDragLeave}
                    onDragStart={this.props.onDragStart}
                />
            </div>
        );
    }
}

export default TileFilter;
