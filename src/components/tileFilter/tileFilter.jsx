import React, { Component } from "react";
import Tile from "../tile/tile.jsx";
import notationConverter from "../../ui-functions/notationConverter";

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
            <div id={id} className="tileFilter">
                <Tile
                    tileConfig={tileConfig}
                    row={row}
                    col={col}
                    rowStartColor={rowStartColor}
                />
            </div>
        );
    }
}

export default TileFilter;
