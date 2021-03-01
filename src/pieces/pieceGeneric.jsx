import React, { Component } from "react";
import imageSelector from "../helper-functions/imageSelector";
import notationConverter from "../helper-functions/notationConverter";

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
        this.flatChessCoords = "";

        //image info
        this.imageFile = imageSelector(char);

        //binding coordinate update function to instance
        this.updatePositionState = this.updatePositionState.bind(this);

        //unique id
        this.id = "";
    }

    //updates coordinates and id
    updatePositionState(newNumCoords) {
        this.numberCoords = newNumCoords;
        this.chessCoords = notationConverter(newNumCoords);
        this.flatChessCoords = `${this.chessCoords[0]}${this.chessCoords[1]}`;
        this.id = `${
            this.flatChessCoords +
            "_" +
            this.char.toUpperCase() +
            "_" +
            this.color
        }`;
    }

    render() {
        return <img src={this.props.imageFile}></img>;
    }
}

export default Piece;
