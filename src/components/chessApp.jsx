import React, { Component } from "react";

//prettier-ignore
import { Pawn, Rook, Knight, Bishop, Queen, King } from "../pieces/allPieceExport.jsx";
import Chessboard from "./chessboard/chessboard.jsx";
import UserInterface from "./ui/userInterface.jsx";
import convertNotation from "../helper-functions/notationConverter";
import boardStateConverter from "../helper-functions/boardStateConverter";
import { cloneDeep, isEmpty } from "lodash";
import { playMoveSound, playCaptureSound } from "../helper-functions/sounds";
import chess from "../chessLogic/chess";
import {
    getPieceWithDom,
    getPieceWithCoords,
} from "../helper-functions/getPieceWithDom";

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
            //initializes game to move 0 and white-to-move
            stepNumber: 0,
            whiteIsNext: true,
        };

        //dragging props
        this.draggingPiece = {};
        this.draggingPieceMoveable = [];

        this.idToPiece = this.idToPiece.bind(this);
        this.moveHandler = this.moveHandler.bind(this);
        this.dragStartHandlerProp = this.dragStartHandler.bind(this);
        this.dragEnterHandlerProp = this.dragEnterHandler.bind(this);
        this.dragLeaveHandlerProp = this.dragLeaveHandler.bind(this);
        (this.whitePieces = []),
            (this.blackPieces = []),
            (this.allPieces = []),
            //remembers
            (this.lastMoveSquares = []);
    }

    componentDidMount(prevProps) {
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

        //initial board configuration
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

        this.whitePieces = whiteCollection;
        this.blackPieces = blackCollection;
        this.allPieces = whiteCollection.concat(blackCollection);

        //initializes starting board configuration and piece collections
        this.setState({
            history: [{ boardConfig }],
        });
    }

    //this function is responsible for returning a piece object given an id
    idToPiece(pieceId) {
        const [movedPiece] = this.allPieces.filter(
            (piece) => piece.id === pieceId,
        );
        return movedPiece;
    }

    //takes in a unique pieceId, origin, and dropped square and returns an updated history entry
    //will eventually use logic to parse out incorrect moves but we are just tryna work rn
    moveHandler(oldBoardConfig, pieceId, from, to) {
        //remove filter of target tile
        const targetTile = document.querySelector(`#${to}`);
        targetTile.classList.remove("dragged-over");

        //get reference to our piece object
        const movedPiece = this.idToPiece(pieceId);

        //resets dragging piece
        this.draggingPiece = {};

        //if piece didn't move, don't do anything
        if (to === from) {
            return;
        }

        //**everything before is guaranteed to happen**

        //returns an object containing information about the move result
        const result = chess(to, from, movedPiece, oldBoardConfig, true);

        //if invalid move, do not proceed
        if (!result.validMove) {
            return;
        }

        // i do not understand why this breaks everything but it does
        // this.whitePieces = result.whitePieces;
        // this.blackPieces = result.blackPieces;
        // this.allPieces = result.allPieces;

        //**everything after only happens if it is a valid move**

        const placeholder = "http://localhost:9000/images/placeholder.png";
        const validDot = "http://localhost:9000/images/validMoveDot.png";
        //play sound
        const imageFileOfTarget = targetTile.firstChild.src;
        if (
            (imageFileOfTarget === placeholder ||
                imageFileOfTarget === validDot) &&
            !result.enPassantEvent
        ) {
            playMoveSound();
        } else {
            playCaptureSound();
        }

        //if pawn move, it lost right to initial two square move
        // if (movedPiece instanceof Pawn) {
        //     this.allPieces.forEach((somePiece) => {
        //         if (somePiece === movedPiece) {
        //             somePiece.moveTwoAvailable = false;
        //         }
        //     });
        // }

        // pawn and king have special moves we must take away if they moved
        this.allPieces.forEach((somePiece) => {
            if (somePiece === movedPiece) {
                //if you move a pawn, loses two step move
                if (movedPiece instanceof Pawn) {
                    somePiece.moveTwoAvailable = false;
                    //if you move a king, loses castling rights
                } else if (movedPiece instanceof King) {
                    somePiece.castlingAvailable = false;
                }
            }
        });

        //stores the squares involved in last move for a moment
        this.lastMoveSquares = [from, to];

        //snag our board configuration returned by chess.js
        let boardConfig = result.finalBoardConfig;

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
        if (isEmpty(piece)) {
            return;
        }
        const originSquare = piece.flatChessCoords;
        const history = this.state.history;
        const { boardConfig } = history[this.state.stepNumber];

        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                //only allow this for whoever's turn it is
                if (this.draggingPiece.white === this.state.whiteIsNext) {
                    //cycle through every tile to see valid moves
                    const tile = convertNotation([col, row]).join("");
                    const tileElement = document.querySelector(`#${tile}`);

                    //is valid move?
                    const result = chess(
                        tile,
                        originSquare,
                        piece,
                        boardConfig,
                        true,
                    );

                    if (result.validMove) {
                        this.draggingPieceMoveable.push(tileElement);
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

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        //console log the history every time for fun
        console.log(history);

        //displays whatever we set 'current' to
        return (
            <div id="chess-app">
                <div id="interface-container">
                    <Chessboard
                        boardConfig={current.boardConfig}
                        playerTurn={this.state.whiteIsNext}
                        lastMoveSquares={this.lastMoveSquares}
                        onMove={this.moveHandler}
                        onDragEnter={this.dragEnterHandlerProp}
                        onDragLeave={this.dragLeaveHandlerProp}
                        onDragStart={this.dragStartHandlerProp}
                    />
                    <UserInterface />
                </div>
            </div>
        );
    }
}

export default ChessApp;
