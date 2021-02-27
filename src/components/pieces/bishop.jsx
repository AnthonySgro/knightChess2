import Piece from "./pieceGeneric.jsx";

class Bishop extends Piece {
    constructor(props, char) {
        super(props, char);
        this.name = "Bishop";
        this.attackingSquares = [];
    }
}

export default Bishop;
