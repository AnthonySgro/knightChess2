import React, { Component } from "react";
import convertNotation from "../../helper-functions/notationConverter";
import { isEmpty } from "lodash";
import ChessPiece from "../chessPiece/chessPiece.jsx";
import { useDrop } from "react-dnd";

//if piece, render the react component for it, else, just show a placeholder
function renderPiece(
    piece,
    piecePresent,
    imageFile,
    numberCoords,
    playerTurn,
    rotation,
) {
    if (piecePresent) {
        return (
            <ChessPiece
                //player turn
                playerTurn={playerTurn}
                //piece info
                numberCoords={numberCoords}
                piece={piece}
                imageFile={imageFile}
                //rotate
                rotation={rotation}
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
        playerTurn,
        rotation,
    } = props;

    //gets coordinate pairs
    const numberCoords = [col, row];
    const chessCoords = convertNotation(numberCoords);

    //determines if we received a piece or a placeholder
    const piecePresent = !isEmpty(tileConfig);
    let piece;

    //if piece, sets piece coordinates to this tile
    if (piecePresent) {
        piece = tileConfig;
        piece.chessCoords = convertNotation(numberCoords);
        piece.flatChessCoords = `${piece.chessCoords[0]}${piece.chessCoords[1]}`;
        piece.id = `${
            piece.flatChessCoords +
            "_" +
            piece.char.toUpperCase() +
            "_" +
            piece.color
        }`;

        //piece.updatePositionState(numberCoords);
    }

    //get image file from piece
    const imageFile = piecePresent
        ? piece.imageFile
        : "/images/placeholder.png";

    //determines color of square
    const selectable = piecePresent ? " selectable" : "";

    //determines if square was involved in last move for color filtering
    const chessCoordsConcat = chessCoords.join("");
    const targetOfLastMove = chessCoordsConcat === lastMoveSquares[0];
    const originOfLastMove = chessCoordsConcat === lastMoveSquares[1];
    const involvedInLastMove = targetOfLastMove || originOfLastMove;
    const color = rowStartColor ? "light-square" : "dark-square";

    let involvedInLastMoveClassName = involvedInLastMove
        ? " involved-in-last-move-tile-" + color
        : "";

    //concatenates class and id names
    const tileClasses =
        `${selectable}` + `${involvedInLastMoveClassName}` + " tile";

    //drag and drop configuration
    const [, drop] = useDrop({
        accept: "piece",
        drop: (item) => {
            const [fromPosition] = item.id.split("_");

            props.onMove(boardConfig, item.id, fromPosition, chessCoordsConcat);

            //remove highlight
            for (let col = 0; col < 8; col++) {
                for (let row = 0; row < 8; row++) {
                    const tile = convertNotation([col, row]).join("");
                    const tileElement = document.querySelector(`#${tile}`);
                    tileElement.classList.remove("moveable");
                    tileElement.classList.remove("moveable-capturable");
                    tileElement.classList.remove(
                        "moveable-capturable-light-square",
                    );
                    tileElement.classList.remove(
                        "moveable-capturable-dark-square",
                    );
                    tileElement.parentNode.classList.remove(
                        "moveable-capturable-parent",
                    );
                }
            }
        },
    });

    //to render
    return (
        <div
            //naming info
            id={chessCoordsConcat}
            className={tileClasses}
            //drag n drop functions
            ref={drop}
            onDragEnter={() => props.onDragEnter(event)}
            onDragLeave={() => props.onDragLeave(event)}
            onDragStart={() => props.onDragStart(event, piece)}
        >
            {renderPiece(
                piece,
                piecePresent,
                imageFile,
                numberCoords,
                playerTurn,
                rotation,
            )}
        </div>
    );
}

export default Tile;
