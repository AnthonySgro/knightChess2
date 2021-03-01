import convertNotation from "./notationConverter";
import boardStateConverter from "./boardStateConverter";

//returns piece instance with dom element
function getPieceWithDom(elem, boardConfig) {
    const coords = convertNotation(elem.id);
    const id = boardStateConverter(coords);

    return boardConfig[id[0]][id[1]];
}

function getPieceWithCoords(coords, boardConfig) {
    const convCoords = convertNotation(coords);
    const id = boardStateConverter(convCoords);

    return boardConfig[id[0]][id[1]];
}

export { getPieceWithDom, getPieceWithCoords };
