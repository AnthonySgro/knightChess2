import Piece from "./pieceGeneric.jsx";

class Knight extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Knight";
        this.attackingSquares = [];
    }
}

export default Knight;
