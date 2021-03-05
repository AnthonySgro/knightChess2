import { isEmpty } from "lodash";
import convertNotation from "../helper-functions/notationConverter";
import basicMove from "./basicMove";
import checkFiltering from "./checkFiltering";

// Detects checkmate with the last moved piece and board configuration
function checkmate(movedPiece, boardConfig) {
    let noMoves = true;
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const enemyPiece = boardConfig[col][row];
            if (!isEmpty(enemyPiece) && enemyPiece.color !== movedPiece.color) {
                for (let col2 = 0; col2 < 8; col2++) {
                    for (let row2 = 0; row2 < 8; row2++) {
                        const someId = convertNotation([col2, 7 - row2]).join(
                            "",
                        );
                        //console.log(someId);
                        const basicMoveObj = basicMove(
                            someId,
                            enemyPiece.flatChessCoords,
                            enemyPiece,
                            boardConfig,
                        );

                        if (basicMoveObj.validMove) {
                            const finalMoveObj = checkFiltering(
                                someId,
                                enemyPiece.flatChessCoords,
                                enemyPiece,
                                boardConfig,
                                basicMoveObj,
                            );

                            if (finalMoveObj.validMove) {
                                noMoves = false;
                            }
                        }
                    }
                }
            }
        }
    }

    return noMoves;
}

export default checkmate;
