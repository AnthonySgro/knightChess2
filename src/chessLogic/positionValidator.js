import convertNotation from "../helper-functions/notationConverter";
function positionValidator(piece, coords) {
    const someChessCoords = convertNotation(coords);
    piece.numberCoords = [coords[0], coords[1]];
    piece.chessCoords = convertNotation(someChessCoords);
    piece.flatChessCoords = `${piece.chessCoords[0]}${piece.chessCoords[1]}`;
    piece.id = `${
        piece.flatChessCoords +
        "_" +
        piece.char.toUpperCase() +
        "_" +
        piece.color
    }`;
}

export default positionValidator;
