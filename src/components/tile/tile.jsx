import React, { Component } from "react";
import notationConverter from "../../ui-functions/notationConverter";
import { isEmpty } from "lodash";
import ChessPiece from "../chessPiece/chessPiece.jsx";
import { Droppable } from "react-beautiful-dnd";

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
    renderPiece(piecePresent, imageFile) {
        const piece = this.props.tileConfig;
        const numberCoords = this.numberCoords;
        const dropId = this.chessCoords.join("");
        const PieceToRender = piece;
        if (piecePresent) {
            return (
                <Droppable droppableId={dropId}>
                    {(provided) => {
                        <ChessPiece
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}
                            numberCoords={numberCoords}
                            piece={piece}
                            imageFile={imageFile}
                        >
                            {provided.placeholder}
                        </ChessPiece>;
                    }}
                </Droppable>
            );
        } else {
            return (
                <Droppable droppableId={dropId}>
                    {(provided) => {
                        <img
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}
                            src={imageFile}
                            alt=""
                        >
                            {provided.placeholder}
                        </img>;
                    }}
                </Droppable>
            );
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
