import React, { Component } from "react";
import notationConverter from "../../ui-functions/notationConverter";
import { isEmpty } from "lodash";

class Tile extends Component {
    constructor(props) {
        super(props);
        this.numberCoords = [props.col, props.row];
        this.chessCoords = notationConverter(this.numberCoords);
        this.state = {
            piecePresent: props.tileConfig.length ? true : false,
        };
    }

    render() {
        const { tileConfig, row, col, rowStartColor } = this.props;

        //grabs the piece
        const piece = this.props.tileConfig;
        const piecePresent = !isEmpty(piece);

        //determines color of square
        const color = rowStartColor ? "light-square" : "dark-square";
        const selectable = piecePresent ? " selectable" : "";

        //concatenates class and id names
        const tileClasses = `${color}` + `${selectable}` + " tile";
        const chessCoordsConcat = this.chessCoords.join("");

        //to render
        return (
            <div id={chessCoordsConcat} className={tileClasses}>
                <img src="/images/placeholder.png" alt=""></img>
            </div>
        );
    }
}

export default Tile;
