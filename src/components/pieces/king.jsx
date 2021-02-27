import Piece from "./pieceGeneric.jsx";

class King extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "King";
        this.attackingSquares = [];
    }
}

export default King;
