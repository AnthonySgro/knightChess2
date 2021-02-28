import React, { Component } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

function ChessPiece(props) {
    const { piece, imageFile, numberCoords } = props;

    // drag and drop configuration
    const id = `${piece.color + piece.char}`;
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
