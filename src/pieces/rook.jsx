import Piece from "./pieceGeneric.jsx";

class Rook extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Rook";
        this.attackingSquares = [];
        this.hasMoved = false;
        this.value = 5;
    }
}

export default Rook;
