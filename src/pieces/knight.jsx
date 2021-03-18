import Piece from "./pieceGeneric.jsx";

class Knight extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Knight";
        this.attackingSquares = [];
        this.value = 3;
    }
}

export default Knight;
