import React, { Component } from "react";
import ReactDom from "react-dom";
import ChessApp from "./components/chessApp.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { playEndGame } from "./helper-functions/sounds";

import Sidebar from "./components/sidebar/sidebar.jsx";

class GamePage extends Component {
    constructor() {
        super();
        this.state = {
            promotion: "Q",
            resignation: { white: false, black: false, all: false },
            drawOffer: { white: false, black: false, all: false },
        };
        this.openRules = this.openRules.bind(this);
        this.closeRules = this.openRules.bind(this);
        this.sendChat = this.sendChat.bind(this);
        this.changePromotion = this.changePromotion.bind(this);
        this.resign = this.resign.bind(this);
        this.offerDraw = this.offerDraw.bind(this);
        this.resetResignAndOfferDraw = this.resetResignAndOfferDraw.bind(this);
    }

    openRules() {
        const rulesTab = document.querySelector("#rules");
        rulesTab.classList.toggle("show");
    }

    sendChat(e) {
        const chatForm = document.querySelector("#chat-form");
        chatForm.addEventListener("submit", (ev) => {
            ev.preventDefault();
        });
        const senderForm = document.querySelector("#msg");
        const msgText = senderForm.value;
        const username = document.querySelector("#phase-information").innerHTML;

        //make the message element
        const msgContainer = document.createElement("DIV");
        msgContainer.classList.add("message");
        const msgContent = document.createElement("P");
        msgContent.classList.add("internal-msg");
        const usernameEle = document.createElement("SPAN");
        usernameEle.classList.add("chat-name");
        usernameEle.innerHTML = `${username}: `;
        const contentEle = document.createElement("SPAN");
        contentEle.classList.add("chat-msg");
        contentEle.innerHTML = msgText;
        msgContent.appendChild(usernameEle);
        msgContent.appendChild(contentEle);
        msgContainer.appendChild(msgContent);

        //add it to the chat
        const chatHistory = document.querySelector("#chat-history");
        chatHistory.prepend(msgContainer);

        //remove sender's text input
        senderForm.value = "";
    }

    changePromotion() {
        const selectedPiece = document.querySelector("#underpromotion");
        this.setState({
            promotion: selectedPiece.value,
        });
    }

    resetResignAndOfferDraw() {
        this.setState({
            drawOffer: { white: false, black: false, all: false },
            resignation: { white: false, black: false, all: false },
        });
    }

    resign() {
        const userFeedback = document.querySelector(".user-feedback");
        const name = document.querySelector("#phase-information").innerHTML;
        userFeedback.innerHTML = `${name} resigned!`;
        playEndGame();
        const chessboard = document.querySelector("#chessboard-backdrop");
        const newGameBtn = document.querySelector("#newGame-btn");
        chessboard.style.filter = "grayscale(100%)";
        newGameBtn.style.visibility = "visible";
        this.setState({
            resignation: { white: false, black: false, all: true },
        });
    }

    offerDraw() {
        const userFeedback = document.querySelector(".user-feedback");
        const name = document.querySelector("#phase-information").innerHTML;
        userFeedback.innerHTML = `${name} offered draw!`;

        this.setState({ drawOffer: { white: true, black: false, all: false } });
    }

    render() {
        return (
            <React.Fragment>
                <Sidebar
                    closeRules={this.closeRules}
                    changePromotion={this.changePromotion}
                    sendChat={this.sendChat}
                    resign={this.resign}
                    offerDraw={this.offerDraw}
                />
                <ChessApp
                    promotion={this.state.promotion}
                    openRules={this.openRules}
                    resignation={this.state.resignation}
                    drawOffer={this.state.drawOffer}
                    resetResignAndOfferDraw={this.resetResignAndOfferDraw}
                />
            </React.Fragment>
        );
    }
}

ReactDom.render(
    <DndProvider backend={HTML5Backend}>
        <GamePage />
    </DndProvider>,
    document.querySelector("#app"),
);
