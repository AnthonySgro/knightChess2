import knightLogic from "./basicMoveLogic/knightLogic";
import bishopLogic from "./basicMoveLogic/bishopLogic";
import rookLogic from "./basicMoveLogic/rookLogic";
import queenLogic from "./basicMoveLogic/queenLogic";
import pawnLogic from "./basicMoveLogic/pawnLogic";
import kingLogic from "./basicMoveLogic/kingLogic";

//returns an object that tells us information about the turn
function chess(target, origin, piece, boardConfig) {
    if (piece === undefined) {
        return { validMove: false };
    }
    //initialize variables
    const pieceType = piece.name;
    let validMove = false;
    let pawnMovedTwo = false;
    let enPassantEvent = false;
    let castleEvent = {
        castleMove: false,
        rookInvolved: {},
        squaresInvolved: [],
        type: "",
        direction: "",
    };

    //get basic piece movemenets
    switch (pieceType) {
        case "Pawn":
            const pawnMoveObject = pawnLogic(
                target,
                origin,
                piece,
                boardConfig,
            );
            validMove = pawnMoveObject.validMove;
            pawnMovedTwo = pawnMoveObject.pawnMovedTwo;
            enPassantEvent = pawnMoveObject.enPassantEvent;
            break;
        case "Knight":
            validMove = knightLogic(target, origin, piece, boardConfig);
            break;
        case "Bishop":
            validMove = bishopLogic(target, origin, piece, boardConfig);
            break;
        case "Rook":
            validMove = rookLogic(target, origin, piece, boardConfig);

            break;
        case "Queen":
            validMove = queenLogic(target, origin, piece, boardConfig);
            break;
        case "King":
            const kingMoveObject = kingLogic(
                target,
                origin,
                piece,
                boardConfig,
            );
            validMove = kingMoveObject.validMove;
            castleEvent = kingMoveObject.castleEvent;
            break;
    }

    //we return the following information about the move we want to make
    return {
        validMove: validMove,
        pawnMovedTwo: pawnMovedTwo,
        enPassantEvent: enPassantEvent,
        castleEvent: castleEvent,
    };
}

export default chess;
