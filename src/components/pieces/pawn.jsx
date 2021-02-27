import Piece from "./pieceGeneric.jsx";

class Pawn extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Pawn";
        this.attackingSquares = [];
    }
}

export default Pawn;
