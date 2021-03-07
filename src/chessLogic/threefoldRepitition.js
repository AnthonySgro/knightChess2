import { countBy } from "lodash";
import { boardStateConverter } from "../helper-functions/boardStateConverter";
import { convertNotation } from "../helper-functions/notationConverter";

function threefoldRepitition(boardHistory) {
    let unique = [...new Set(boardHistory)];
    let historyAndDuplications = unique.map((boardConfig) => [
        boardConfig,
        boardHistory.filter((obj) => obj === boardConfig).length,
    ]);

    // console.log(unique);
}

export default threefoldRepitition;
