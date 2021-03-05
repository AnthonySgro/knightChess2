import basicMove from "./basicMove";
import checkFiltering from "./checkFiltering";

function chessMove(to, from, piece, boardConfig) {
    const basicResult = basicMove(to, from, piece, boardConfig);
    if (basicResult.validMove) {
        let finalResult = checkFiltering(
            to,
            from,
            piece,
            boardConfig,
            basicResult,
        );

        return finalResult;
    } else {
        return {
            validMove: false,
            finalBoardConfig: boardConfig,
            pawnMovedTwo: false,
            castleEvent: {
                castleMove: false,
                rookInvolved: {},
                squaresInvolved: [],
                type: "",
                direction: "",
            },
            enPassantEvent: false,
            promotionEvent: false,
        };
    }
}

export default chessMove;
