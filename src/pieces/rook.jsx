import Piece from "./pieceGeneric.jsx";

class Rook extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Rook";
        this.attackingSquares = [];
        this.hasMoved = false;
    }
}

export default Rook;
