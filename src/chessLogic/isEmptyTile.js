import { getPieceWithCoords } from "../helper-functions/getPieceWithDom";
import { isEmpty } from "lodash";

function isEmptyTile(target, boardConfig) {
    //see if a piece is present at the tile
    const piecePresent = getPieceWithCoords(target, boardConfig);

    //if it is empty, true
    return isEmpty(piecePresent);
}

export default isEmptyTile;
