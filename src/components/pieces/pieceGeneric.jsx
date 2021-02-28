import React, { Component } from "react";
import imageSelector from "../ui/imageSelector";
import notationConverter from "../ui/notationConverter";

class Piece {
    constructor(chessBoardProps, char) {
        //init char
        this.char = char;

        //color info
        this.white = char.toUpperCase() === char;
        this.color = this.white ? "white" : "black";

        //coordinate info
        this.numberCoords = ["", ""];
        this.chessCoords = notationConverter(this.numberCoords);

        //image info
        this.imageFile = imageSelector(char);

        //binding coordinate update function to instance
        this.updatePositionState = this.updatePositionState.bind(this);
    }

    //updates coordinates
    updatePositionState(newNumCoords) {
        this.numberCoords = newNumCoords;
        this.chessCoords = notationConverter(newNumCoords);
    }

    render() {
        return <img src={this.props.imageFile}></img>;
    }
}

export default Piece;
