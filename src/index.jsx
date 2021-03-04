import React, { Component } from "react";
import ReactDom from "react-dom";
import ChessApp from "./components/chessApp.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Sidebar from "./components/sidebar/sidebar.jsx";
import History from "./components/history/history.jsx";

class GamePage extends Component {
    constructor() {
        super();
        this.state = {
            promotion: "Q",
        };
        this.openRules = this.openRules.bind(this);
        this.closeRules = this.openRules.bind(this);
        this.sendChat = this.sendChat.bind(this);
        this.changePromotion = this.changePromotion.bind(this);
        this;
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

    render() {
        return (
            <React.Fragment>
                <Sidebar
                    closeRules={this.closeRules}
                    changePromotion={this.changePromotion}
                    sendChat={this.sendChat}
                />
                <ChessApp
                    promotion={this.state.promotion}
                    openRules={this.openRules}
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
