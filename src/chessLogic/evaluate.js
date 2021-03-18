import { isEmpty } from "lodash";

//iterates through all squares after move to clear styling and return king location
function evaluate(boardConfig) {
    let remainingWhitePieces = [];
    let remainingBlackPieces = [];

    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const piece = boardConfig[col][row];
            if (!isEmpty(piece)) {
                if (piece.white) {
                    remainingWhitePieces.push(piece);
                } else {
                    remainingBlackPieces.push(piece);
                }
            }
        }
    }

    let remainingPieces = remainingWhitePieces.concat(remainingBlackPieces);

    // Initialize scores
    let blackScore = 0;
    let whiteScore = 0;

    for (let piece of remainingPieces) {
        if (piece.white) {
            whiteScore += piece.value;
        } else {
            blackScore += piece.value;
        }
    }

    let evaluation = whiteScore - blackScore;

    return evaluation;
}

export default evaluate;
