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
        return (
            <div id="rules" className="rules">
                <h2>How To Play:</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Facilis ad sequi cumque, earum itaque hic et accusamus
                    commodi.
                </p>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                <button
                    id="close-btn"
                    className="btn redbtn"
                    onClick={() => this.closeRules(event)}
                >
                    Close
                </button>
            </div>
        );
    }
}

export default Sidebar;
