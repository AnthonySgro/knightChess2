import React, { Component } from "react";
import imageSelector from "../ui-functions/imageSelector";
import notationConverter from "../ui-functions/notation-converter";

class Piece extends Component {
    constructor(props, char) {
        super(props, char);
        this.char = char;
        this.imageFile = imageSelector(char);
        this.numberCoords = ["", ""];
        this.chessCoords = notationConverter(this.numberCoords);
    }

    render() {
        <img src={this.imageFile} alt="" />;
    }
}

export default Piece;
