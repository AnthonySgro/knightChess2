import React, { Component } from "react";
import { useDrag, DragPreviewImage, DragLayer } from "react-dnd";

function ChessPiece(props) {
    const { piece, imageFile, numberCoords, playerTurn, rotation } = props;

    //sets piece coordinates
    piece.updatePositionState(numberCoords);

    // drag and drop configuration
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: "piece", id: piece.id },
        collect: (monitor) => {
            return { isDragging: !!monitor.isDragging() };
        },
    });

    //update position and display on screen with dragging config
    piece.updatePositionState(numberCoords);

    const rotateStyle = {
        transform: `rotate(${rotation}deg)`,
    };

    const opacityStyle = {
        opacity: isDragging ? 0.5 : 1,
    };

    //if it is this piece's turn, we make it draggable
    // if (piece.white === playerTurn) {

    //if it's white turn, allow user to go
    if (piece.white && piece.white === playerTurn) {
        return (
            <React.Fragment>
                <DragPreviewImage connect={preview} src={imageFile} />
                <img
                    style={{ ...opacityStyle, ...rotateStyle }}
                    ref={drag}
                    src={imageFile}
                ></img>
            </React.Fragment>
        );
        //otherwise, it cannot generate a valid move
    } else {
        return <img src={imageFile} style={{ ...rotateStyle }}></img>;
    }
}

export default ChessPiece;
