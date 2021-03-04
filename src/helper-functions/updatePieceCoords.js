function updatePieceCoords(piece, flatChessCoords) {
    piece.chessCoords = [flatChessCoords[0]][flatChessCoords[1]];
    piece.flatChessCoords = flatChessCoords;
    piece.id = `${
        piece.flatChessCoords +
        "_" +
        piece.char.toUpperCase() +
        "_" +
        piece.color
    }`;
}

export default updatePieceCoords;
