import React, { Component } from "react";

class Sidebar extends Component {
    constructor() {
        super();
    }
    closeRules(e) {
        const rulesTab = document.querySelector("#rules");
        rulesTab.classList.remove("show");
    }
    render() {
        const { changePromotion } = this.props;
        return (
            <div id="rules" className="rules">
                <div className="settings-container" id="chat-container">
                    <h2 id="chat-title">Chat</h2>
                    <div className="chat-element" id="chat-history">
                        <div className="message">
                            <p className="internal-msg">
                                <span className="chat-name">Username: </span>
                                <span className="chat-msg">
                                    Text goes here!
                                </span>
                            </p>
                        </div>
                    </div>
                    <form action="#" className="chat-element" id="chat-form">
                        <div className="chat-element" id="msg-container">
                            <textarea
                                name="msg"
                                id="msg"
                                cols="60"
                                rows="1"
                                placeholder="Type message..."
                            ></textarea>
                            <button
                                className="redbtn"
                                id="submit-msg"
                                onClick={() => this.props.sendChat(event)}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
                <div
                    className="settings-container"
                    id="underpromotion-container"
                >
                    {" "}
                    <label htmlFor="underpromotion" id="promolabel">
                        Advanced Promotion:
                    </label>
                    <select
                        name="underpromotion"
                        id="underpromotion"
                        onChange={() => changePromotion(event)}
                    >
                        <option value="Q">Queen</option>
                        <option value="N">Knight</option>
                        <option value="R">Rook</option>
                        <option value="B">Bishop</option>
                    </select>
                </div>
            </div>
        );
    }
}

export default Sidebar;
