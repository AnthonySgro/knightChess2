import convertNotation from "../helper-functions/notationConverter";
import boardStateConverter from "../helper-functions/boardStateConverter";
import { cloneDeep, isEmpty } from "lodash";
import chess from "./chess";
import castleHandler from "./basicMoveLogic/castleHandler";

//this performs a move, and checks to see if the piece's king is still in check.
//if it is, valid move = false
function checkFiltering(target, origin, piece, boardConfig, basicMoveObj) {
    //get variables initialized
    let validMove = basicMoveObj.validMove;
    const pawnMovedTwo = basicMoveObj.pawnMovedTwo;
    const castleEvent = basicMoveObj.castleEvent;
    const enPassantEvent = basicMoveObj.enPassantEvent;

    let allPieces = [];
    let whitePieces = [];
    let blackPieces = [];

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

    //now we need to handle special moves
    //castling handler
    if (castleEvent.castleMove) {
        simulBoardConfig = castleHandler(
            toCoord,
            toNumCoords,
            castleEvent,
            boardConfig,
        );
    }

    //enPassant updater
    if (enPassantEvent) {
        if (piece.white) {
            simulBoardConfig[toCoord[0] + 1][toCoord[1]] = {};
        } else {
            simulBoardConfig[toCoord[0] - 1][toCoord[1]] = {};
        }
    }

    //pawn move two tiles handler
    if (pawnMovedTwo) {
        piece.vulnerableToEnPassant = true;
    }

    //updates all piece collections
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const cycleTilePiece = simulBoardConfig[col][row];

            //if we encounter one of the other player's pieces
            if (!isEmpty(cycleTilePiece)) {
                allPieces.push(cycleTilePiece);
                if (cycleTilePiece.white) {
                    whitePieces.push(cycleTilePiece);
                } else {
                    blackPieces.push(cycleTilePiece);
                }
            }
        }
    }

    //en passant vulnerability handler
    for (let i = 0; i < allPieces.length; i++) {
        if (allPieces[i].name === "Pawn") {
            if (allPieces[i] !== piece) {
                allPieces[i].vulnerableToEnPassant = false;
            }
        }
    }

    //finds the king of this player on simulated board
    let thisKing = {};
    for (let i = 0; i < allPieces.length; i++) {
        const currentPiece = allPieces[i];
        if (
            currentPiece.name === "King" &&
            currentPiece.color === piece.color
        ) {
            thisKing = currentPiece;
        }
    }

    //if we moved the king, we have to update its coordinates
    if (piece === thisKing) {
        thisKing.updatePositionState(convertNotation(target));
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
                //check to see if it is is a valid move to attack our king
                const result = chess(
                    thisKing.flatChessCoords,
                    cycleTilePiece.flatChessCoords,
                    cycleTilePiece,
                    simulBoardConfig,
                    false,
                );

                let castleChecker1;
                let castleChecker2;

                const { squaresInvolved, castleMove } = castleEvent;
                //if castling, we have to check more than just the king's position
                if (castleMove) {
                    //makes sure you don't castle through or out of check
                    castleChecker1 = chess(
                        squaresInvolved[0],
                        cycleTilePiece.flatChessCoords,
                        cycleTilePiece,
                        simulBoardConfig,
                    );

                    castleChecker2 = chess(
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
            }
        }
    }

    return {
        validMove: validMove,
        finalBoardConfig: simulBoardConfig,
        castleEvent: castleEvent,
        enPassantEvent: enPassantEvent,
        allPieces: allPieces,
        whitePieces: whitePieces,
        blackPieces: blackPieces,
    };
}

export default checkFiltering;
