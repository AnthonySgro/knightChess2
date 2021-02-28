import React, { Component } from "react";
import notationConverter from "../../ui-functions/notationConverter";
import { isEmpty } from "lodash";
import Piece from "../pieces/pieceGeneric.jsx";
import ChessPiece from "../chessPiece/chessPiece.jsx";

class Tile extends Component {
    constructor(props) {
        super(props);
        this.numberCoords = [props.col, props.row];
        this.chessCoords = notationConverter(this.numberCoords);
        this.state = {
            piecePresent: props.tileConfig.length ? true : false,
        };
    }

    //if piece, render the react component for it, else, just show a placeholder
    renderPiece(piece, piecePresent, imageFile, numberCoords) {
        if (piecePresent) {
            return (
                <ChessPiece
                    numberCoords={numberCoords}
                    piece={piece}
                    imageFile={imageFile}
                />
            );
        } else {
            return <img src={imageFile} alt="" />;
        }
    }

    render() {
        const { tileConfig, row, col, rowStartColor } = this.props;

        //determines if we received a piece or a placeholder
        const piecePresent = !isEmpty(this.props.tileConfig);
        let piece;

        //if piece, sets piece coordinates to this tile
        if (piecePresent) {
            piece = this.props.tileConfig;
            //piece.updatePositionState(this.numberCoords);
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
                {this.renderPiece(
                    piece,
                    piecePresent,
                    imageFile,
                    this.numberCoords,
                )}
            </div>
        );
    }
}

export default Tile;
