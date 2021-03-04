import React, { Component } from "react";

//prettier-ignore
import { Pawn, Rook, Knight, Bishop, Queen, King } from "../pieces/allPieceExport.jsx";
import UserInterface from "./ui/userInterface.jsx";
import convertNotation from "../helper-functions/notationConverter";
import { cloneDeep, isEmpty, update } from "lodash";
import {
    playMoveSound,
    playCaptureSound,
    playOutOfBoundSound,
    playEndGame,
} from "../helper-functions/sounds";
import chess from "../chessLogic/chess";
import { getPieceWithDom } from "../helper-functions/getPieceWithDom";
import checkFiltering from "../chessLogic/checkFiltering.js";
import updatePieceCoords from "../helper-functions/updatePieceCoords";

//components
import Chessboard from "./chessboard/chessboard.jsx";
import boardStateConverter from "../helper-functions/boardStateConverter.js";

//ChessApp Component renders entire application
class ChessApp extends Component {
    constructor() {
        super();
        this.state = {
            //tracks the board configuration over time
            history: [
                {
                    //this is our board representation
                    //**CHANGING THIS WILL CHANGE THE OUTPUT**
                    boardConfig: [
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, {}],
                    ],
                },
            ],
            //initializes game to move 0 and white-to-move and board rotation
            stepNumber: 0,
            whiteIsNext: true,
            rotation: 0,
        };

        //dragging props
        this.draggingPiece = {};
        this.draggingPieceMoveable = [];

        //function binding
        this.idToPiece = this.idToPiece.bind(this);
        this.moveHandler = this.moveHandler.bind(this);
        this.dragStartHandlerProp = this.dragStartHandler.bind(this);
        this.dragEnterHandlerProp = this.dragEnterHandler.bind(this);
        this.dragLeaveHandlerProp = this.dragLeaveHandler.bind(this);
        this.setUpBoard = this.setUpBoard.bind(this);
        this.moveBack = this.moveBack.bind(this);
        this.moveForward = this.moveForward.bind(this);
        this.rotateBoard = this.rotateBoard.bind(this);

        //pieces
        this.whitePieces = [];
        this.blackPieces = [];
        this.allPieces = [];

        //remembers
        this.lastMoveSquares = [];
    }

    componentDidMount() {
        this.setUpBoard();
    }

    //this function is responsible for returning a piece object given an id
    idToPiece(pieceId) {
        const [movedPiece] = this.allPieces.filter(
            (piece) => piece.id === pieceId,
        );

        return movedPiece;
    }

    //takes in a unique pieceId, origin, and dropped square and returns an updated history entry
    moveHandler(oldBoardConfig, pieceId, from, to) {
        //remove filter of target tile
        const targetTile = document.querySelector(`#${to}`);
        targetTile.classList.remove("dragged-over");

        //don't do anything if you're setting the piece down
        if (from === to) {
            return;
        }

        //if user is not on the most up-to-date move, don't continue
        const gameHistory = this.state.history;
        if (this.state.stepNumber !== gameHistory.length - 1) {
            return;
        }

        //get reference to our piece object
        const movedPiece = this.idToPiece(pieceId);

        //resets dragging piece
        this.draggingPiece = {};

        //**everything before is guaranteed to happen**

        //sees if the move is a basic move of the piece
        const basicResult = chess(to, from, movedPiece, oldBoardConfig);

        //if invalid basic move, do not proceed and play sound
        if (!basicResult.validMove) {
            playOutOfBoundSound();
            return;
        }

        //filters that move to see if it leaves king in check
        let finalResult = checkFiltering(
            to,
            from,
            movedPiece,
            oldBoardConfig,
            basicResult,
        );

        //if move would leave king in check, do not proceed
        if (!finalResult.validMove) {
            return;
        }

        //**everything after only happens if it is a valid move**

        //update our moved piece id/coords
        updatePieceCoords(movedPiece, to);

        //get references to all pieces and finds enemy king for dealing check detection
        let oppKing = {};
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                //while we're here, take out all check styling
                const tile = convertNotation([col, row]).join("");
                const tileElement = document.querySelector(`#${tile}`);
                tileElement.parentElement.classList.remove("light-tile-check");
                tileElement.parentElement.classList.remove("dark-tile-check");

                const piece = finalResult.finalBoardConfig[col][row];
                if (!isEmpty(piece)) {
                    //every move, every piece is no longer vulnerable to enpassant
                    if (piece.name === "Pawn") {
                        piece.vulnerableToEnPassant = false;
                    }

                    //if other king, grab reference to it for check processing
                    if (
                        piece.name === "King" &&
                        piece.color !== movedPiece.color
                    ) {
                        oppKing = piece;
                    }
                }
            }
        }

        //promotion (including underpromotion)
        let promo = {};
        if (to[1] === "1" && movedPiece.name === "Pawn") {
            switch (this.props.promotion) {
                case "Q":
                    promo = new Queen(this.props, "q");
                    break;
                case "N":
                    promo = new Knight(this.props, "n");
                    break;
                case "R":
                    promo = new Rook(this.props, "r");
                    promo.hasMoved = true;
                    break;
                case "B":
                    promo = new Bishop(this.props, "b");
                    break;
            }
            this.blackPieces.push(promo);
        } else if (to[1] === "8" && movedPiece.name === "Pawn") {
            switch (this.props.promotion) {
                case "Q":
                    promo = new Queen(this.props, "Q");
                    break;
                case "N":
                    promo = new Knight(this.props, "N");
                    break;
                case "R":
                    promo = new Rook(this.props, "R");
                    promo.hasMoved = true;
                    break;
                case "B":
                    promo = new Bishop(this.props, "B");
                    break;
            }
        }

        //if promoted, update board
        if (!isEmpty(promo)) {
            const coords = convertNotation(to);
            const id = boardStateConverter(coords);
            finalResult.finalBoardConfig[id[0]][id[1]] = promo;
            updatePieceCoords(promo, to);
            this.allPieces.push(promo);
        }

        //restrict one-time moves
        if (movedPiece.name === "King") {
            movedPiece.castlingAvailable = false;
        } else if (movedPiece.name === "Pawn") {
            movedPiece.moveTwoAvailable = false;
        } else if (movedPiece.name === "Rook") {
            movedPiece.hasMoved = true;
        }

        //pawn move two tiles handler
        if (finalResult.pawnMovedTwo) {
            movedPiece.vulnerableToEnPassant = true;
        }

        let endGame = false;

        //check for enemy king in check
        let dealtCheck = false;
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                //cycles through all same-color pieces
                const cycleTilePiece = finalResult.finalBoardConfig[col][row];
                if (cycleTilePiece.color === movedPiece.color) {
                    const dealCheckDetection = chess(
                        oppKing.flatChessCoords,
                        cycleTilePiece.flatChessCoords,
                        cycleTilePiece,
                        finalResult.finalBoardConfig,
                    );

                    //if enemy king is within a basic movement, it's a check
                    if (dealCheckDetection.validMove) {
                        dealtCheck = true;
                    }
                }
            }
        }

        //check for checkmate
        let noMoves = true;
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                const enemyPiece = finalResult.finalBoardConfig[col][row];
                if (
                    !isEmpty(enemyPiece) &&
                    enemyPiece.color !== movedPiece.color
                ) {
                    for (let col2 = 0; col2 < 8; col2++) {
                        for (let row2 = 0; row2 < 8; row2++) {
                            const someId = convertNotation([
                                col2,
                                7 - row2,
                            ]).join("");
                            //console.log(someId);
                            const basicMoveObj = chess(
                                someId,
                                enemyPiece.flatChessCoords,
                                enemyPiece,
                                finalResult.finalBoardConfig,
                            );

                            if (basicMoveObj.validMove) {
                                const finalMoveObj = checkFiltering(
                                    someId,
                                    enemyPiece.flatChessCoords,
                                    enemyPiece,
                                    finalResult.finalBoardConfig,
                                    basicMoveObj,
                                );

                                if (finalMoveObj.validMove) {
                                    noMoves = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        //checkmate
        const userFeedback = document.querySelector(".user-feedback");
        if (noMoves && dealtCheck) {
            endGame = true;
            userFeedback.innerHTML = "Checkmate!";
            //stalemate
        } else if (noMoves) {
            endGame = true;
            const userFeedback = document.querySelector(".user-feedback");
            userFeedback.innerHTML = "Stalemate!";
        }

        //if check, color appropriate squares
        if (dealtCheck) {
            const kingSqr = document.querySelector(
                `#${oppKing.flatChessCoords}`,
            );
            if (kingSqr.parentElement.classList.contains("light-square")) {
                kingSqr.parentElement.classList.add("light-tile-check");
            } else {
                kingSqr.parentElement.classList.add("dark-tile-check");
            }
        }

        //get the new board
        let newBoardConfiguration = finalResult.finalBoardConfig;

        //sounds
        const placeholder = "http://localhost:9000/images/placeholder.png";
        const imageFileOfTarget = targetTile.firstChild.src;
        if (endGame) {
            playEndGame();
            const chessboard = document.querySelector("#chessboard-backdrop");
            const newGameBtn = document.querySelector("#newGame-btn");
            chessboard.style.filter = "grayscale(100%)";
            newGameBtn.style.visibility = "visible";
        } else {
            console.log();
            if (
                imageFileOfTarget === placeholder &&
                !finalResult.enPassantEvent
            ) {
                playMoveSound();
            } else {
                playCaptureSound();
            }
        }

        //stores the squares involved in last move for a moment
        this.lastMoveSquares = [from, to];

        //snag our board configuration returned by chess.js
        let boardConfig = newBoardConfiguration;

        //increment move
        const newStepNumber = this.state.stepNumber + 1;

        //get reference to current state
        const history = this.state.history;
        const newBoardPosition = { boardConfig };

        //updates whole board and adds history log
        this.setState({
            whiteIsNext: !this.state.whiteIsNext,
            stepNumber: newStepNumber,
            history: [...history, newBoardPosition],
        });
    }

    //purely for getting the piece that is being dragged
    dragStartHandler(e, piece) {
        this.draggingPieceMoveable = [];
        this.draggingPiece = piece;

        if (isEmpty(piece) || piece === undefined) {
            return;
        }

        const originSquare = piece.flatChessCoords;
        const history = this.state.history;
        const { boardConfig } = history[this.state.stepNumber];
        if (this.state.stepNumber !== history.length - 1) {
            return;
        }
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                //only allow this for whoever's turn it is
                if (this.draggingPiece.white === this.state.whiteIsNext) {
                    //cycle through every tile to see valid moves
                    let tile = convertNotation([col, row]).join("");
                    const tileElement = document.querySelector(`#${tile}`);
                    let finalResult = { validMove: false };

                    // sees if the move is a basic move of the piece
                    let basicResult = chess(
                        tile,
                        originSquare,
                        this.draggingPiece,
                        boardConfig,
                    );

                    if (basicResult.validMove) {
                        //filters that move to see if it leaves king in check
                        finalResult = checkFiltering(
                            tile,
                            originSquare,
                            this.draggingPiece,
                            boardConfig,
                            basicResult,
                        );

                        if (finalResult.validMove) {
                            this.draggingPieceMoveable.push(tileElement);
                        }
                    }
                }
            }
        }

        //search the valid moves of whatever we are dragging
        for (let i = 0; i < this.draggingPieceMoveable.length; i++) {
            //get the piece
            const curElement = this.draggingPieceMoveable[i];
            const tilePiece = getPieceWithDom(curElement, boardConfig);

            //if there's no piece we will style differently
            if (isEmpty(tilePiece)) {
                // this.draggingPieceMoveable[i].firstChild.src =
                //     "http://localhost:9000/images/validMoveDot.png";
                curElement.classList.add("moveable");
            } else {
                if (curElement.parentNode.classList.contains("light-square")) {
                    curElement.classList.add(
                        "moveable-capturable-light-square",
                    );
                } else if (
                    curElement.parentNode.classList.contains("dark-square")
                ) {
                    curElement.classList.add("moveable-capturable-dark-square");
                }

                curElement.parentNode.classList.add(
                    "moveable-capturable-parent",
                );
            }
        }
    }

    //aesthetics for entering a square on drag
    dragEnterHandler(e) {
        //stop the DOM from doing dumb things we don't want it to
        e.stopPropagation();
        e.preventDefault();

        //figures out if we are dragging a piece
        const target = e.target.parentNode;
        const pieceDragging = !isEmpty(this.draggingPiece);

        //current config
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        //to fill
        let correctTurn;
        let draggingPieceOriginTile;
        let notOverOrigin;
        let notSameColor;

        //if we are dragging a piece (correct input), we can set our variables
        if (pieceDragging) {
            draggingPieceOriginTile = document.querySelector(
                `#${this.draggingPiece.flatChessCoords}`,
            );
            notOverOrigin = target !== draggingPieceOriginTile;
            const highlightedPiece = getPieceWithDom(
                target,
                current.boardConfig,
            );
            notSameColor = highlightedPiece.white !== this.state.whiteIsNext;
            correctTurn = this.draggingPiece.white === this.state.whiteIsNext;
        }

        //if we are dragging a piece over something other than its origin square
        //and it is the correct turn!
        if (pieceDragging && !!notOverOrigin && correctTurn && notSameColor) {
            //when we enter a square, we want to edit the tileFilter
            if (this.draggingPieceMoveable.includes(e.target.parentNode)) {
                target.classList.add("dragged-over");
            }
        }
    }

    //aesthetics for leaving a square on drag
    dragLeaveHandler(e) {
        e.preventDefault();

        const pieceDragging = !isEmpty(this.draggingPiece);
        let correctTurn;

        //if we are dragging a piece, figure out if it is that player's turn
        if (pieceDragging) {
            correctTurn = this.draggingPiece.white === this.state.whiteIsNext;
        }

        //if it is, we can continue with our aesthetics
        if (pieceDragging && correctTurn) {
            const tile = e.target.parentNode;
            const tileFilter = tile.parentNode;
            tile.classList.remove("dragged-over");
        }
    }

    setUpBoard() {
        const chessboard = document.querySelector("#chessboard-backdrop");
        const newGameBtn = document.querySelector("#newGame-btn");
        const userFeedback = document.querySelector(".user-feedback");
        chessboard.style.filter = "grayscale(0%)";
        newGameBtn.style.visibility = "hidden";
        userFeedback.innerHTML = "";

        //reset styles
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                const tile = convertNotation([col, row]).join("");
                const tileElement = document.querySelector(`#${tile}`);
                tileElement.classList.remove(
                    "involved-in-last-move-tile-light-square",
                );
                tileElement.classList.remove(
                    "involved-in-last-move-tile-dark-square",
                );
                tileElement.parentElement.classList.remove("light-tile-check");
                tileElement.parentElement.classList.remove("dark-tile-check");
            }
        }

        let R1 = new Rook(this.props, "R");
        let N1 = new Knight(this.props, "N");
        let B1 = new Bishop(this.props, "B");
        let Q1 = new Queen(this.props, "Q");
        let K1 = new King(this.props, "K");
        let B2 = new Bishop(this.props, "B");
        let N2 = new Knight(this.props, "N");
        let R2 = new Rook(this.props, "R");
        let P1 = new Pawn(this.props, "P");
        let P2 = new Pawn(this.props, "P");
        let P3 = new Pawn(this.props, "P");
        let P4 = new Pawn(this.props, "P");
        let P5 = new Pawn(this.props, "P");
        let P6 = new Pawn(this.props, "P");
        let P7 = new Pawn(this.props, "P");
        let P8 = new Pawn(this.props, "P");

        let r1 = new Rook(this.props, "r");
        let n1 = new Knight(this.props, "n");
        let b1 = new Bishop(this.props, "b");
        let q1 = new Queen(this.props, "q");
        let k1 = new King(this.props, "k");
        let b2 = new Bishop(this.props, "b");
        let n2 = new Knight(this.props, "n");
        let r2 = new Rook(this.props, "r");
        let p1 = new Pawn(this.props, "p");
        let p2 = new Pawn(this.props, "p");
        let p3 = new Pawn(this.props, "p");
        let p4 = new Pawn(this.props, "p");
        let p5 = new Pawn(this.props, "p");
        let p6 = new Pawn(this.props, "p");
        let p7 = new Pawn(this.props, "p");
        let p8 = new Pawn(this.props, "p");

        //prettier-ignore
        const whiteCollection = [R1,N1,B1,Q1,K1,B2,N2,R2,P1,P2,P3,P4,P5,P6,P7,P8];

        //prettier-ignore
        const blackCollection = [r1,n1,b1,q1,k1,b2,n2,r2,p1,p2,p3,p4,p5,p6,p7,p8];

        //initial board configuration, edit to experiment with positions
        const boardConfig = [
            [r1, n1, b1, q1, k1, b2, n2, r2],
            [p1, p2, p3, p4, p5, p6, p7, p8],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [P1, P2, P3, P4, P5, P6, P7, P8],
            [R1, N1, B1, Q1, K1, B2, N2, R2],
        ];

        //test boards
        const boardConfig1 = [
            [{}, {}, {}, {}, k1, {}, {}, {}],
            [{}, {}, P1, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, K1, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
        ];

        const boardConfig2 = [
            [{}, {}, {}, {}, k1, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, K1, B2, N2, R2],
        ];

        this.whitePieces = whiteCollection;
        this.blackPieces = blackCollection;
        this.allPieces = whiteCollection.concat(blackCollection);

        //initializes starting board configuration and piece collections
        this.setState({
            history: [{ boardConfig }],
            stepNumber: 0,
            whiteIsNext: true,
        });
    }

    moveBack(e) {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                const tile = convertNotation([col, row]).join("");
                const tileElement = document.querySelector(`#${tile}`);
                tileElement.classList.remove(
                    "involved-in-last-move-tile-light-square",
                );
                tileElement.classList.remove(
                    "involved-in-last-move-tile-dark-square",
                );
                tileElement.parentElement.classList.remove("light-tile-check");
                tileElement.parentElement.classList.remove("dark-tile-check");
            }
        }
        if (this.state.stepNumber > 0) {
            this.setState({
                stepNumber: this.state.stepNumber - 1,
            });
        }
    }

    moveForward(e) {
        if (this.state.stepNumber < this.state.history.length - 1) {
            this.setState({
                stepNumber: this.state.stepNumber + 1,
            });
        }
    }

    rotateBoard(deg) {
        const { rotation } = this.state;
        const newDegrees = (rotation + 180) % 360;
        this.setState({
            rotation: newDegrees,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        console.log(current);

        //displays whatever we set 'current' to
        return (
            <div id="chess-app" className="major-comp">
                <div id="interface-container" className="major-comp">
                    <Chessboard
                        rotation={this.state.rotation}
                        boardConfig={current.boardConfig}
                        playerTurn={this.state.whiteIsNext}
                        lastMoveSquares={this.lastMoveSquares}
                        onMove={this.moveHandler}
                        onDragEnter={this.dragEnterHandlerProp}
                        onDragLeave={this.dragLeaveHandlerProp}
                        onDragStart={this.dragStartHandlerProp}
                    />
                    <UserInterface
                        turn={this.state.whiteIsNext}
                        history={history}
                        moveForward={this.moveForward}
                        moveBack={this.moveBack}
                        rotateBoard={this.rotateBoard}
                        newGame={this.setUpBoard}
                        openRules={this.props.openRules}
                    />
                </div>
            </div>
        );
    }
}

export default ChessApp;
