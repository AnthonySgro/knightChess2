import { getPieceWithCoords } from "../helper-functions/getPieceWithDom";
import adjacentTile from "./adjacentTile";
import { isEmpty } from "lodash";
import continuousPieceMovement from "./continuousPieceMovement";

//returns an object that tells us information about the turn
function chess(target, origin, piece, boardConfig) {
    const pieceType = piece.name;
    let validMove = false;

    //gets attacked piece info
    const attackedPiece = getPieceWithCoords(target, boardConfig);
    const capturingPiece = !isEmpty(attackedPiece);
    let capturingOppPiece;
    if (capturingPiece) {
        capturingOppPiece = attackedPiece.color !== piece.color;
    }

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

            //if we are capturing
            if (capturingPiece) {
                //if we are capturing as a pawn should
                if (
                    target ===
                        adjacentTile(origin, "up-right", 1, piece.color) ||
                    target === adjacentTile(origin, "up-left", 1, piece.color)
                ) {
                    //if it is the opposite color, valid capture
                    if (capturingOppPiece) {
                        validMove = true;
                    }
                }
            }

            //after a pawn moves, it loses ability to move two squares
            if (validMove === true) {
                piece.moveTwoAvailable = false;
            }
            break;
        case "Knight":
            //finds two steps in each direction to prepare for all knight moves
            const prelimUp = adjacentTile(origin, "up", 2, piece.color);
            const prelimRight = adjacentTile(origin, "right", 2, piece.color);
            const prelimDown = adjacentTile(origin, "down", 2, piece.color);
            const prelimLeft = adjacentTile(origin, "left", 2, piece.color);

            //knight moves
            switch (target) {
                case adjacentTile(prelimUp, "right", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimUp, "left", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimRight, "up", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimRight, "down", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimDown, "right", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimDown, "left", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimLeft, "up", 1, piece.color):
                    validMove = true;
                    break;
                case adjacentTile(prelimLeft, "down", 1, piece.color):
                    validMove = true;
                    break;
            }

            //if we are capturing our own piece, not a valid move
            if (capturingPiece && !capturingOppPiece) {
                validMove = false;
            }
            break;
        case "Bishop":
            //we are going to find the direction by making one true
            let bishopDirection = "";

            //find what direction we are going in
            for (let i = 1; i <= 8; i++) {
                switch (target) {
                    case adjacentTile(origin, "up-right", i, piece.color):
                        bishopDirection = "up-right";
                        break;
                    case adjacentTile(origin, "down-right", i, piece.color):
                        bishopDirection = "down-right";
                        break;
                    case adjacentTile(origin, "down-left", i, piece.color):
                        bishopDirection = "down-left";
                        break;
                    case adjacentTile(origin, "up-left", i, piece.color):
                        bishopDirection = "up-left";
                        break;
                }
            }

            //use function to return valid moves in any direction
            let validMoves = continuousPieceMovement(
                origin,
                bishopDirection,
                piece,
                boardConfig,
            );

            //if valid move...
            if (validMoves.includes(target)) {
                validMove = true;
            }
            break;
        case "Rook":
            //we are going to find the direction by making one true
            let rookDirection = "";

            //find what direction we are going in
            for (let i = 1; i <= 8; i++) {
                switch (target) {
                    case adjacentTile(origin, "up", i, piece.color):
                        rookDirection = "up";
                        break;
                    case adjacentTile(origin, "down", i, piece.color):
                        rookDirection = "down";
                        break;
                    case adjacentTile(origin, "left", i, piece.color):
                        rookDirection = "left";
                        break;
                    case adjacentTile(origin, "right", i, piece.color):
                        rookDirection = "right";
                        break;
                }
            }

            //use function to return valid moves in any direction
            let validMoves = continuousPieceMovement(
                origin,
                rookDirection,
                piece,
                boardConfig,
            );

            //if valid move...
            if (validMoves.includes(target)) {
                validMove = true;
            }
            break;
    }

    return { validMove: validMove };
}

export default chess;
