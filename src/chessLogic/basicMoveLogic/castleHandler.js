import convertNotation from "../../helper-functions/notationConverter";
import positionValidator from "../positionValidator";

function castleHandler(to, toNum, castleEvent, boardConfig) {
    let simulBoardConfig = boardConfig;

    const rook = castleEvent.rookInvolved;
    const type = castleEvent.type;
    const direction = castleEvent.direction;

    //we have to change the rook position
    if (direction === "right" && type === "short") {
        simulBoardConfig[to[0]][to[1] - 1] = rook;
        simulBoardConfig[to[0]][to[1] + 1] = {};
        rook.numberCoords = [toNum[0] - 1, toNum[1]];
    } else if (direction === "left" && type === "short") {
        simulBoardConfig[to[0]][to[1] - 1] = rook;
        simulBoardConfig[to[0]][to[1] + 1] = {};
        rook.numberCoords = [toNum[0] - 1, toNum[1]];
    } else if (direction === "right" && type === "long") {
        simulBoardConfig[to[0]][to[1] + 1] = rook;
        simulBoardConfig[to[0]][to[1] - 2] = {};
        rook.numberCoords = [toNum[0] + 1, toNum[1]];
    } else if (direction === "left" && type === "long") {
        simulBoardConfig[to[0]][to[1] + 1] = rook;
        simulBoardConfig[to[0]][to[1] - 2] = {};
        rook.numberCoords = [toNum[0] + 1, toNum[1]];
    }

    //update rook info
    positionValidator(rook, rook.numberCoords);
    // rook.chessCoords = convertNotation(rook.numberCoords);
    // rook.flatChessCoords = `${rook.chessCoords[0]}${rook.chessCoords[1]}`;
    // rook.id = `${
    //     rook.flatChessCoords + "_" + rook.char.toUpperCase() + "_" + rook.color
    // }`;

    return simulBoardConfig;
}
export default castleHandler;
