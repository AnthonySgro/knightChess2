import basicMove from "./basicMove";

// Says if enemy king in check with board configuration and most recently moved piece
function check(movedPiece, oppKing, boardConfig) {
    let dealtCheck = false;

    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            // Cycles through all same-color pieces
            const cycleTilePiece = boardConfig[col][row];
            if (cycleTilePiece.color === movedPiece.color) {
                // Searches all basic moves
                const dealCheckDetection = basicMove(
                    oppKing.flatChessCoords,
                    cycleTilePiece.flatChessCoords,
                    cycleTilePiece,
                    boardConfig,
                );

                // If enemy king is within a basic movement, it's a check
                if (dealCheckDetection.validMove) {
                    dealtCheck = true;
                }
            }
        }
    }

    return dealtCheck;
}

export default check;
