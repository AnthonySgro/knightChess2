import Piece from "./pieceGeneric.jsx";

class Pawn extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Pawn";
        this.attackingSquares = [];
        this.moveTwoAvailable = true;
        this.vulnerableToEnPassant = false;
    }
}

export default Pawn;
