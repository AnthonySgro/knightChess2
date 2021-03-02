import { getPieceWithCoords } from "../helper-functions/getPieceWithDom";
import convertNotation from "../helper-functions/notationConverter";
import boardStateConverter from "../helper-functions/boardStateConverter";
import adjacentTile from "./adjacentTile";
import { cloneDeep, isEmpty } from "lodash";
import continuousPieceMovement from "./continuousPieceMovement";
import isEmptyTile from "./isEmptyTile";
import Pawn from "../pieces/pawn.jsx";

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
            const tileAhead = adjacentTile(origin, "up", 1, piece.color);
            const twoTilesAhead = adjacentTile(origin, "up", 2, piece.color);
            const lAttack = adjacentTile(origin, "up-left", 1, piece.color);
            const rAttack = adjacentTile(origin, "up-right", 1, piece.color);
            switch (target) {
                //moving up one
                case tileAhead:
                    //see if a piece is present at the tile
                    validMove = isEmptyTile(target, boardConfig);
                    break;
                //moving up two (first move only)
                case twoTilesAhead:
                    //see if a piece is present at the tile
                    const targetEmpty = isEmptyTile(twoTilesAhead, boardConfig);

                    //also have to check if there's a piece present on the first square
                    const nextTileEmpty = isEmptyTile(tileAhead, boardConfig);

                    //if both are empty, and pawn hasn't moved yet
                    if (
                        targetEmpty &&
                        nextTileEmpty &&
                        piece.moveTwoAvailable
                    ) {
                        pawnMovedTwo = true;
                        validMove = true;
                    }

                    break;
                //attacking
                case lAttack:
                    //if we are capturing an opponent's piece
                    if (capturingOppPiece) {
                        validMove = true;
                        //if we aren't, it could be enpassant
                    } else if (!capturingPiece) {
                        //find enPassant square
                        const enPassantSquare = adjacentTile(
                            lAttack,
                            "down",
                            1,
                            piece.color,
                        );

                        //if theres a piece
                        if (!isEmptyTile(enPassantSquare, boardConfig)) {
                            //is it a pawn?
                            const passantPiece = getPieceWithCoords(
                                enPassantSquare,
                                boardConfig,
                            );

                            if (passantPiece instanceof Pawn) {
                                //is it vulnerable to en passant?
                                if (passantPiece.vulnerableToEnPassant) {
                                    validMove = true;
                                    enPassantEvent = true;
                                }
                            }
                        }
                    }
                    break;
                case rAttack:
                    //if we are capturing an opponent's piece
                    if (capturingOppPiece) {
                        validMove = true;
                    } else if (!capturingPiece) {
                        //find enPassant square
                        const enPassantSquare = adjacentTile(
                            rAttack,
                            "down",
                            1,
                            piece.color,
                        );

                        //if theres a piece
                        if (!isEmptyTile(enPassantSquare, boardConfig)) {
                            //is it a pawn?
                            const passantPiece = getPieceWithCoords(
                                enPassantSquare,
                                boardConfig,
                            );

                            if (passantPiece instanceof Pawn) {
                                //is it vulnerable to en passant?
                                if (passantPiece.vulnerableToEnPassant) {
                                    validMove = true;
                                    enPassantEvent = true;
                                }
                            }
                        }
                    }

                    //if en passant

                    break;
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
                    case adjacentTile(origin, "down-left", i, piece.color):
                        bishopDirection = "down-left";
                        break;
                    case adjacentTile(origin, "up-right", i, piece.color):
                        bishopDirection = "up-right";
                        break;
                    case adjacentTile(origin, "down-right", i, piece.color):
                        bishopDirection = "down-right";
                        break;
                    case adjacentTile(origin, "up-left", i, piece.color):
                        bishopDirection = "up-left";
                        break;
                }
            }

            //use function to return valid moves in any direction
            let validBishopMoves = continuousPieceMovement(
                origin,
                bishopDirection,
                piece,
                boardConfig,
            );

            //if valid move...
            if (validBishopMoves.includes(target)) {
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
            let validRookMoves = continuousPieceMovement(
                origin,
                rookDirection,
                piece,
                boardConfig,
            );

            //if valid move...
            if (validRookMoves.includes(target)) {
                piece.hasMoved = true;
                validMove = true;
            }
            break;
        case "Queen":
            //we are going to find the direction by making one true
            let queenDirection = "";

            //find what direction we are going in
            for (let i = 1; i <= 8; i++) {
                switch (target) {
                    case adjacentTile(origin, "up", i, piece.color):
                        queenDirection = "up";
                        break;
                    case adjacentTile(origin, "down", i, piece.color):
                        queenDirection = "down";
                        break;
                    case adjacentTile(origin, "left", i, piece.color):
                        queenDirection = "left";
                        break;
                    case adjacentTile(origin, "right", i, piece.color):
                        queenDirection = "right";
                        break;
                    case adjacentTile(origin, "up-right", i, piece.color):
                        queenDirection = "up-right";
                        break;
                    case adjacentTile(origin, "down-right", i, piece.color):
                        queenDirection = "down-right";
                        break;
                    case adjacentTile(origin, "down-left", i, piece.color):
                        queenDirection = "down-left";
                        break;
                    case adjacentTile(origin, "up-left", i, piece.color):
                        queenDirection = "up-left";
                        break;
                }
            }

            //use function to return valid moves in any direction
            let validQueenMoves = continuousPieceMovement(
                origin,
                queenDirection,
                piece,
                boardConfig,
            );

            //if valid move...
            if (validQueenMoves.includes(target)) {
                validMove = true;
            }

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

            //castling detection
            switch (target) {
                //short castle
                case adjacentTile(origin, direction[0], 2, piece.color):
                    let shortCastSquares = [];
                    let shortSquareStatus = [];
                    for (let i = 1; i < 4; i++) {
                        shortCastSquares.push(
                            adjacentTile(origin, direction[0], i, piece.color),
                        );
                        shortSquareStatus.push(
                            isEmptyTile(shortCastSquares[i - 1], boardConfig),
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
                            adjacentTile(origin, direction[1], i, piece.color),
                        );
                        longSquareStatus.push(
                            isEmptyTile(longCastSquares[i - 1], boardConfig),
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

            if (validMove === true) {
                piece.castlingAvailable = false;
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
            simulBoardConfig[toCoord[0] + 1][toCoord[1]] = {};
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
    };
}

export default chess;
