import Piece from "./pieceGeneric.jsx";

class Queen extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Queen";
        this.attackingSquares = [];
        this.value = 9;
    }
}

export default Queen;
