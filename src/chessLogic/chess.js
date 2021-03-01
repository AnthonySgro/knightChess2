import { getPieceWithCoords } from "../helper-functions/getPieceWithDom";
import adjacentTile from "./adjacentTile";
import { isEmpty } from "lodash";

//returns an object that tells us information about the turn
function chess(target, origin, piece, boardConfig) {
    const pieceType = piece.name;
    let validMove = false;

    switch (pieceType) {
        case "Pawn":
            //pawns can move two on the first move
            if (piece.moveTwoAvailable === true) {
                if (target === adjacentTile(origin, "up", 2, piece.color)) {
                    validMove = true;
                }
            }

            //normal pawn behavior
            if (target === adjacentTile(origin, "up", 1, piece.color)) {
                validMove = true;
            }

            //attacking normally
            const attackedPiece = getPieceWithCoords(target, boardConfig);
            const capturingOppPiece = attackedPiece.color !== piece.color;
            const capturingPiece = !isEmpty(attackedPiece);
            if (capturingPiece) {
                if (
                    target ===
                        adjacentTile(origin, "up-right", 1, piece.color) ||
                    target === adjacentTile(origin, "up-left", 1, piece.color)
                ) {
                    if (capturingOppPiece) {
                        validMove = true;
                    }
                }
            }

            //after a pawn moves, it loses ability to move two squares
            if (validMove === true) {
                piece.moveTwoAvailable = false;
            }
    }

    return { validMove: validMove };
}

export default chess;
