import { isEmpty } from "lodash";

function insufficientMaterial(allPieces, boardConfig) {
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

    // Insufficient material checker
    switch (whitePieceCollection.length) {
        case 0:
            //If only two kings are left
            if (blackPieceCollection.length === 0) {
                insufficientMaterial = true;
            } else if (blackPieceCollection.length === 1) {
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

export default insufficientMaterial;
