import React, { Component } from "react";
import imageSelector from "../ui/imageSelector";
import notationConverter from "../ui/notationConverter";

class Piece {
    constructor(chessBoardProps, char) {
        this.char = char;
        this.numberCoords = ["", ""];
        this.chessCoords = notationConverter(this.numberCoords);
        this.imageFile = imageSelector(char);
        this.updatePositionState = this.updatePositionState.bind(this);
    }

    updatePositionState(newNumCoords) {
        this.numberCoords = newNumCoords;
        this.chessCoords = notationConverter(newNumCoords);
    }

    render() {
        const { piece, imageFile } = this.props;
        return <img src={imageFile}></img>;
    }
}

export default Piece;
