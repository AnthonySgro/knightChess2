import React, { Component } from "react";

class ChessPiece extends Component {
    render() {
        const { piece, imageFile, numberCoords } = this.props;
        piece.updatePositionState(numberCoords);
        return <img src={imageFile}></img>;
    }
}

export default ChessPiece;
