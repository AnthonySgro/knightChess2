import updatePieceCoords from "./updatePieceCoords";
import { isEmpty } from "lodash";

function updatePieceAlive(allPieces, boardConfig) {
    let insufficientMaterial = false;
    let whitePieceCollection = [];
    let blackPieceCollection = [];
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const tile = boardConfig[col][row];
            if (!isEmpty(tile) && tile.name !== "King") {
                if (tile.white) {
                    whitePieceCollection.push(tile.name);
                } else {
                    blackPieceCollection.push(tile.name);
                }
            }
        }
    }

    // console.log(blackPieceCollection.length);
    // console.log(whitePieceCollection.length);

    //If only two kings are left
    switch (whitePieceCollection.length) {
        case 0:
            if (blackPieceCollection.length === 0) {
                insufficientMaterial = true;
            } else if (blackPieceCollection === 0) {
                if (blackPieceCollection[0] === "Bishop") {
                    insufficientMaterial = true;
                } else if (blackPieceCollection[0] === "Knight") {
                    insufficientMaterial = true;
                }
            }
        case 1:
            if (blackPieceCollection.length === 0) {
                if (whitePieceCollection[0] === "Bishop") {
                    insufficientMaterial = true;
                } else if (whitePieceCollection[0] === "Knight") {
                    insufficientMaterial = true;
                }
            }
    }
    return insufficientMaterial;
}

export default updatePieceAlive;
