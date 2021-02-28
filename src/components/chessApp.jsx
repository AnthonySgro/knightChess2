import React, { Component } from "react";
import Chessboard from "./chessboard/chessboard.jsx";
import UserInterface from "./ui/userInterface.jsx";
import {
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
} from "./pieces/allPieceExport.jsx";

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
            whitePieces: [],
            blackPieces: [],
            allPieces: [],
        };
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

        //initializes starting board configuration and piece collections
        this.setState({
            whitePieces: whiteCollection,
            blackPieces: blackCollection,
            allPieces: whiteCollection.concat(blackCollection),
            history: [{ boardConfig }],
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        console.log(current);
        //displays whatever we set 'current' to
        return (
            <div id="chess-app">
                <div id="interface-container">
                    <Chessboard boardConfig={current.boardConfig} />
                    <UserInterface />
                </div>
            </div>
        );
    }
}

export default ChessApp;
