import Piece from "./pieceGeneric.jsx";

class Queen extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Queen";
        this.attackingSquares = [];
    }
}

export default Queen;
