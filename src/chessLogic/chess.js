import { getPieceWithCoords } from "../helper-functions/getPieceWithDom";
import convertNotation from "../helper-functions/notationConverter";
import boardStateConverter from "../helper-functions/boardStateConverter";
import adjacentTile from "./adjacentTile";
import { cloneDeep, isEmpty } from "lodash";
import continuousPieceMovement from "./continuousPieceMovement";
import isEmptyTile from "./isEmptyTile";
import { Pawn, King } from "../pieces/allPieceExport.jsx";
import knightLogic from "./basicMoveLogic/knightLogic";
import bishopLogic from "./basicMoveLogic/bishopLogic";
import rookLogic from "./basicMoveLogic/rookLogic";
import queenLogic from "./basicMoveLogic/queenLogic";
import pawnLogic from "./basicMoveLogic/pawnLogic";

//returns an object that tells us information about the turn
function chess(target, origin, piece, boardConfig, checkDetection) {
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

    //gets attacked piece info
    const attackedPiece = getPieceWithCoords(target, boardConfig);
    const capturingPiece = !isEmpty(attackedPiece);
    let capturingOppPiece;
    if (capturingPiece) {
        capturingOppPiece = attackedPiece.color !== piece.color;
    }

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
            //normal move detection (1 in every direction)
            switch (target) {
                case adjacentTile(origin, "up", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "down", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "left", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "right", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "up-right", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "down-right", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "down-left", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
                case adjacentTile(origin, "up-left", 1, piece.color):
                    validMove =
                        isEmptyTile(target, boardConfig) || capturingOppPiece;
                    break;
            }

            let direction = [];
            if (piece.white) {
                direction.push("right");
                direction.push("left");
            } else {
                direction.push("left");
                direction.push("right");
            }

            //only search here if castling is available still (otherwise it won't work)
            if (piece.castlingAvailable) {
                //castling detection
                switch (target) {
                    //short castle
                    case adjacentTile(origin, direction[0], 2, piece.color):
                        let shortCastSquares = [];
                        let shortSquareStatus = [];
                        for (let i = 1; i < 4; i++) {
                            shortCastSquares.push(
                                adjacentTile(
                                    origin,
                                    direction[0],
                                    i,
                                    piece.color,
                                ),
                            );
                            shortSquareStatus.push(
                                isEmptyTile(
                                    shortCastSquares[i - 1],
                                    boardConfig,
                                ),
                            );
                        }

                        const shortSquarePiece = getPieceWithCoords(
                            shortCastSquares[2],
                            boardConfig,
                        );

                        //if the squares next to the king are empty, and there's a rook that hasn't moved
                        if (
                            shortSquareStatus[0] &&
                            shortSquareStatus[1] &&
                            shortSquarePiece.name === "Rook" &&
                            shortSquarePiece.hasMoved === false
                        ) {
                            validMove = true;
                            castleEvent.castleMove = true;
                            castleEvent.rookInvolved = shortSquarePiece;
                            castleEvent.squaresInvolved = [
                                origin,
                                shortCastSquares[0],
                                shortCastSquares[1],
                            ];

                            castleEvent.type = "short";
                            castleEvent.direction = direction[0];
                        }
                        break;

                    case adjacentTile(origin, direction[1], 2, piece.color):
                        let longCastSquares = [];
                        let longSquareStatus = [];
                        for (let i = 1; i < 5; i++) {
                            longCastSquares.push(
                                adjacentTile(
                                    origin,
                                    direction[1],
                                    i,
                                    piece.color,
                                ),
                            );
                            longSquareStatus.push(
                                isEmptyTile(
                                    longCastSquares[i - 1],
                                    boardConfig,
                                ),
                            );
                        }

                        const longSquarePiece = getPieceWithCoords(
                            longCastSquares[3],
                            boardConfig,
                        );

                        //if the squares next to the king are empty, and there's a rook that hasn't moved
                        if (
                            longSquareStatus[0] &&
                            longSquareStatus[1] &&
                            longSquareStatus[2] &&
                            longSquarePiece.name === "Rook" &&
                            longSquarePiece.hasMoved === false
                        ) {
                            validMove = true;
                            castleEvent.castleMove = true;
                            castleEvent.rookInvolved = longSquarePiece;
                            castleEvent.squaresInvolved = [
                                origin,
                                longCastSquares[0],
                                longCastSquares[1],
                            ];
                            castleEvent.type = "long";
                            castleEvent.direction = direction[1];
                        }
                        break;
                }
            }

            break;
    }

    //we can turn off check detection
    if (!checkDetection) {
        return { validMove: validMove };
    }

    //we are going to send these back
    let simulBoardConfig;
    let allPieces = [];
    let whitePieces = [];
    let blackPieces = [];

    //simulate move to ensure king is not in check
    if (validMove && checkDetection) {
        //if moved two, pawn is vulnerable to enPassant
        if (pawnMovedTwo) {
            piece.vulnerableToEnPassant = true;
        }

        //get my coordinates prepped to work with the history object
        const toNumCoords = convertNotation([target[0], target[1]]);
        const toCoord = boardStateConverter(toNumCoords);
        const frNumCoords = convertNotation([origin[0], origin[1]]);
        const frCoord = boardStateConverter(frNumCoords);

        //deep copy of the board configuration so we don't alter state
        simulBoardConfig = cloneDeep(boardConfig);

        //perform move on simulated board
        simulBoardConfig[frCoord[0]][frCoord[1]] = {};
        simulBoardConfig[toCoord[0]][toCoord[1]] = piece;

        //castling handler
        if (castleEvent.castleMove) {
            const rook = castleEvent.rookInvolved;
            const type = castleEvent.type;
            const direction = castleEvent.direction;

            //we have to change the rook position as well
            if (direction === "right" && type === "short") {
                simulBoardConfig[toCoord[0]][toCoord[1] - 1] = rook;
                simulBoardConfig[toCoord[0]][toCoord[1] + 1] = {};
                rook.numberCoords = [toNumCoords[0] - 1, toNumCoords[1]];
            } else if (direction === "left" && type === "short") {
                simulBoardConfig[toCoord[0]][toCoord[1] - 1] = rook;
                simulBoardConfig[toCoord[0]][toCoord[1] + 1] = {};
                rook.numberCoords = [toNumCoords[0] - 1, toNumCoords[1]];
            } else if (direction === "right" && type === "long") {
                simulBoardConfig[toCoord[0]][toCoord[1] + 1] = rook;
                simulBoardConfig[toCoord[0]][toCoord[1] - 2] = {};
                rook.numberCoords = [toNumCoords[0] + 1, toNumCoords[1]];
            } else if (direction === "left" && type === "long") {
                simulBoardConfig[toCoord[0]][toCoord[1] + 1] = rook;
                simulBoardConfig[toCoord[0]][toCoord[1] - 2] = {};
                rook.numberCoords = [toNumCoords[0] + 1, toNumCoords[1]];
            }

            //update rook info
            rook.chessCoords = convertNotation(rook.numberCoords);
            rook.flatChessCoords = `${rook.chessCoords[0]}${rook.chessCoords[1]}`;
            rook.id = `${
                rook.flatChessCoords +
                "_" +
                rook.char.toUpperCase() +
                "_" +
                rook.color
            }`;
        }

        //enPassant updater
        if (enPassantEvent) {
            if (piece.white) {
                simulBoardConfig[toCoord[0] + 1][toCoord[1]] = {};
            } else {
                simulBoardConfig[toCoord[0] - 1][toCoord[1]] = {};
            }
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
            if (allPieces[i] instanceof Pawn) {
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

        //if we moved the king, we have to update its position
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
                            false,
                        );

                        castleChecker2 = chess(
                            squaresInvolved[1],
                            cycleTilePiece.flatChessCoords,
                            cycleTilePiece,
                            simulBoardConfig,
                            false,
                        );

                        //takes away castling if you are going through a check
                        if (
                            castleChecker1.validMove ||
                            castleChecker2.validMove
                        ) {
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
    }

    return {
        validMove: validMove,
        finalBoardConfig: simulBoardConfig,
        castleEvent: castleEvent,
        enPassantEvent: enPassantEvent,
        allPieces: allPieces,
        whitePieces: whitePieces,
        blackPieces: blackPieces,
        pawnMoveTwo: pawnMovedTwo,
    };
}

export default chess;
