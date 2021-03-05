import { Rook, Knight, Bishop, Queen } from "../pieces/allPieceExport.jsx";

function promotion(to, piece, userSelectedPiece, props) {
    let promo = {};

    //if pawn reaches first rank, new black piece according to user (defaul Queen)
    if (to[1] === "1" && piece.name === "Pawn") {
        switch (userSelectedPiece) {
            case "Q":
                promo = new Queen(props, "q");
                break;
            case "N":
                promo = new Knight(props, "n");
                break;
            case "R":
                promo = new Rook(props, "r");
                promo.hasMoved = true;
                break;
            case "B":
                promo = new Bishop(props, "b");
                break;
        }
        //8th rank, it is a white piece
    } else if (to[1] === "8" && piece.name === "Pawn") {
        switch (userSelectedPiece) {
            case "Q":
                promo = new Queen(props, "Q");
                break;
            case "N":
                promo = new Knight(props, "N");
                break;
            case "R":
                promo = new Rook(props, "R");
                promo.hasMoved = true;
                break;
            case "B":
                promo = new Bishop(props, "B");
                break;
        }
    }

    //return the new piece
    return promo;
}

export default promotion;
