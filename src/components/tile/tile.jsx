import React, { Component } from "react";
import notationConverter from "../../helper-functions/notationConverter";
import { isEmpty } from "lodash";
import ChessPiece from "../chessPiece/chessPiece.jsx";
import { useDrop } from "react-dnd";

//if piece, render the react component for it, else, just show a placeholder
function renderPiece(piece, piecePresent, imageFile, numberCoords) {
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

//our actual tile component
function Tile(props) {
    const {
        boardConfig,
        tileConfig,
        row,
        col,
        rowStartColor,
        lastMoveSquares,
    } = props;

    //gets coordinate pairs
    const numberCoords = [col, row];
    const chessCoords = notationConverter(numberCoords);

    //determines if we received a piece or a placeholder
    const piecePresent = !isEmpty(tileConfig);
    let piece;

    //if piece, sets piece coordinates to this tile
    if (piecePresent) {
        piece = tileConfig;
        //piece.updatePositionState(this.numberCoords);
    }

    //get image file from piece
    const imageFile = piecePresent
        ? piece.imageFile
        : "/images/placeholder.png";

    //determines color of square
    const color = rowStartColor ? "light-square" : "dark-square";
    const selectable = piecePresent ? " selectable" : "";

    //determines if square was involved in last move for color filtering
    const chessCoordsConcat = chessCoords.join("");
    const targetOfLastMove = chessCoordsConcat === lastMoveSquares[0];
    const originOfLastMove = chessCoordsConcat === lastMoveSquares[1];
    const involvedInLastMove = targetOfLastMove || originOfLastMove;
    let involvedInLastMoveClassName = involvedInLastMove
        ? " involved-in-last-move-tile-" + color
        : "";

    //concatenates class and id names
    const tileClasses =
        `${color}` +
        `${selectable}` +
        `${involvedInLastMoveClassName}` +
        " tile";

    //drag and drop configuration
    const [, drop] = useDrop({
        accept: "piece",
        drop: (item) => {
            const [fromPosition] = item.id.split("_");
            props.onMove(boardConfig, item.id, fromPosition, chessCoordsConcat);
        },
    });

    //to render
    return (
        <div
            id={chessCoordsConcat}
            className={tileClasses}
            ref={drop}
            onDragEnter={() => props.onDragEnter(event)}
            onDragLeave={() => props.onDragLeave(event)}
            onDragStart={() => props.onDragStart(event, piece)}
        >
            {renderPiece(piece, piecePresent, imageFile, numberCoords)}
        </div>
    );
}

export default Tile;
