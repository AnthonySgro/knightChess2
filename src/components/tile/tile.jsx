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

        //determines if we received a piece or a placeholder
        const piecePresent = !isEmpty(this.props.tileConfig);
        let piece;

        //if piece, sets piece coordinates to this tile
        if (piecePresent) {
            piece = this.props.tileConfig;
            piece.numberCoords = this.numberCoords;
            piece.chessCoords = notationConverter(this.numberCoords);
        }

        //get image file from piece
        const imageFile = piecePresent
            ? piece.imageFile
            : "/images/placeholder.png";

        //determines color of square
        const color = rowStartColor ? "light-square" : "dark-square";
        const selectable = piecePresent ? " selectable" : "";

        //concatenates class and id names
        const tileClasses = `${color}` + `${selectable}` + " tile";
        const chessCoordsConcat = this.chessCoords.join("");

        //to render
        return (
            <div id={chessCoordsConcat} className={tileClasses}>
                <img src={imageFile} alt=""></img>
            </div>
        );
    }
}

export default Tile;
