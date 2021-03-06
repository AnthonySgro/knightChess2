import convertNotation from "../helper-functions/notationConverter";
import boardStateConverter from "../helper-functions/boardStateConverter";
import { cloneDeep, isEmpty } from "lodash";
import basicMove from "./basicMove";
import castleHandler from "./basicMoveLogic/castleHandler";
import positionValidator from "./positionValidator";
import { Queen, Rook, Knight, Bishop } from "../pieces/allPieceExport.jsx";
import updatePieceCoords from "../helper-functions/updatePieceCoords";

//this performs a move, and checks to see if the piece's king is still in check.
//if it is, valid move = false
function checkFiltering(target, origin, piece, boardConfig, basicMoveObj) {
    //get variables initialized
    let validMove = basicMoveObj.validMove;
    const pawnMovedTwo = basicMoveObj.pawnMovedTwo;
    const castleEvent = basicMoveObj.castleEvent;
    const enPassantEvent = basicMoveObj.enPassantEvent;
    const promotionEvent = basicMoveObj.pawnPromotionEvent;

    //get my coordinates prepped to work with the history object
    const toNumCoords = convertNotation([target[0], target[1]]);
    const toCoord = boardStateConverter(toNumCoords);
    const frNumCoords = convertNotation([origin[0], origin[1]]);
    const frCoord = boardStateConverter(frNumCoords);

    //deep copy of the board configuration so we don't alter state
    let simulBoardConfig = cloneDeep(boardConfig);

    //perform basic move on simulated board
    simulBoardConfig[frCoord[0]][frCoord[1]] = {};
    simulBoardConfig[toCoord[0]][toCoord[1]] = piece;

    //for special moves involving two pieces moving, we need to update the other piece's move
    //castling updater will move the rook
    if (castleEvent.castleMove) {
        simulBoardConfig = castleHandler(
            toCoord,
            toNumCoords,
            castleEvent,
            simulBoardConfig,
        );
    }

    //enPassant updater will remove the attacked pawn
    if (enPassantEvent) {
        if (piece.white) {
            simulBoardConfig[toCoord[0] + 1][toCoord[1]] = {};
        } else {
            simulBoardConfig[toCoord[0] - 1][toCoord[1]] = {};
        }
    }

    let thisKing = {};
    let oppKing = {};
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const cycleTilePiece = simulBoardConfig[col][row];
            if (!isEmpty(cycleTilePiece)) {
                if (
                    cycleTilePiece.name === "King" &&
                    cycleTilePiece.color === piece.color
                ) {
                    //finds the king of this player on simulated board
                    if (piece.name === "King") {
                        thisKing = cycleTilePiece;
                    } else if (piece.name !== "King") {
                        thisKing = cloneDeep(cycleTilePiece);
                    }
                } else if (
                    cycleTilePiece.name === "King" &&
                    cycleTilePiece.color !== piece.color
                ) {
                    oppKing = cycleTilePiece;
                }
            }
        }
    }

    //if we moved the king, we have to update its coordinates
    if (piece == thisKing) {
        updatePieceCoords(thisKing, target);
    }

    //check cycle through simulated board
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const cycleTilePiece = simulBoardConfig[col][row];
            //if we encounter one of the other player's pieces
            if (
                !isEmpty(cycleTilePiece) &&
                cycleTilePiece.color !== piece.color
            ) {
                //check to see if it is is a basic move to attack our king
                const result = basicMove(
                    thisKing.flatChessCoords,
                    cycleTilePiece.flatChessCoords,
                    cycleTilePiece,
                    simulBoardConfig,
                );
                let castleChecker1;
                let castleChecker2;

                const { squaresInvolved, castleMove } = castleEvent;

                //if castling, we have to check more than just the king's position
                if (castleMove) {
                    //makes sure you don't castle through or out of check
                    castleChecker1 = basicMove(
                        squaresInvolved[0],
                        cycleTilePiece.flatChessCoords,
                        cycleTilePiece,
                        simulBoardConfig,
                    );
                    castleChecker2 = basicMove(
                        squaresInvolved[1],
                        cycleTilePiece.flatChessCoords,
                        cycleTilePiece,
                        simulBoardConfig,
                    );
                    //takes away castling if you are going through a check
                    if (castleChecker1.validMove || castleChecker2.validMove) {
                        validMove = false;
                    }
                }

                //if king will be in check, it isnt a valid move
                if (result.validMove) {
                    validMove = false;
                }

                //check to see if any of our pieces are attacking enemy king
            }
        }
    }

    //we have to change back our experimental king positioning
    positionValidator(thisKing, origin);
    if (piece.name === "King") {
        positionValidator(piece, origin);
    }

    if (!validMove) {
        return {
            validMove: validMove,
            finalBoardConfig: boardConfig,
            pawnMovedTwo: false,
            castleEvent: {
                castleMove: false,
                rookInvolved: {},
                squaresInvolved: [],
                type: "",
                direction: "",
            },
            enPassantEvent: false,
            promotionEvent: false,
        };
    } else {
        return {
            validMove: validMove,
            newBoardConfig: simulBoardConfig,
            pawnMovedTwo: pawnMovedTwo,
            castleEvent: castleEvent,
            enPassantEvent: enPassantEvent,
            promotionEvent: promotionEvent,
        };
    }
}

export default checkFiltering;
