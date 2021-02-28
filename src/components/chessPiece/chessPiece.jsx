import React, { Component } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

function ChessPiece(props) {
    const { piece, imageFile, numberCoords } = props;

    //sets piece coordinates
    piece.updatePositionState(numberCoords);
    const chessCoords = `${piece.chessCoords[0]}${piece.chessCoords[1]}`;

    // drag and drop configuration
    const id = `${chessCoords + "_" + piece.char + "_" + piece.color}`;
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: "piece", id: id },
        collect: (monitor) => {
            return { isDragging: !!monitor.isDragging() };
        },
    });

    //update position and display on screen with dragging config
    piece.updatePositionState(numberCoords);
    return (
        <React.Fragment>
            <DragPreviewImage connect={preview} src={imageFile} />
            <img
                ref={drag}
                src={imageFile}
                style={{ opacity: isDragging ? 0 : 1 }}
            ></img>
        </React.Fragment>
    );
}

export default ChessPiece;
