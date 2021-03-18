import convertNotation from "./notationConverter";
import { isEmpty } from "lodash";

//iterates through all squares after move to clear styling and return king location
function postMoveBoardSweep(givenPiece, boardConfig) {
    let oppKing = {};
    let remainingWhitePieces = [];
    let remainingBlackPieces = [];

    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            //while we're here, take out all check styling
            const tile = convertNotation([col, row]).join("");
            const tileElement = document.querySelector(`#${tile}`);
            tileElement.parentElement.classList.remove("light-tile-check");
            tileElement.parentElement.classList.remove("dark-tile-check");

            const piece = boardConfig[col][row];
            if (!isEmpty(piece)) {
                //every move, every piece is no longer vulnerable to enpassant
                if (piece.name === "Pawn") {
                    piece.vulnerableToEnPassant = false;
                }

                //if other king, grab reference to it for check processing
                if (piece.name === "King" && piece.color !== givenPiece.color) {
                    oppKing = piece;
                }

                if (piece.white) {
                    remainingWhitePieces.push(piece);
                } else {
                    remainingBlackPieces.push(piece);
                }
            }
        }
    }

    return { oppKing, remainingWhitePieces, remainingBlackPieces };
}

export default postMoveBoardSweep;
