//sound
function playMoveSound() {
    let moveSound = new Audio("/sounds/Move.mp3");
    let playMove = moveSound.play();
    if (playMove !== undefined) {
        playMove
            .then(function () {})
            .catch(function (error) {
                console.log("Failed to load move sound");
            });
    }
}

//sound
function playCaptureSound() {
    let captureSound = new Audio("/sounds/Capture.mp3");
    let playCapture = captureSound.play();
    if (playCapture !== undefined) {
        playCapture
            .then(function () {})
            .catch(function (error) {
                console.log("Failed to load capture sound");
            });
    }
}

function playOutOfBoundSound() {
    let moveSound = new Audio("/sounds/OutOfBound.mp3");
    let playMove = moveSound.play();
    if (playMove !== undefined) {
        playMove
            .then(function () {})
            .catch(function (error) {
                console.log("Failed to load move sound");
            });
    }
}

function playEndGame() {
    let moveSound = new Audio("/sounds/GenericNotify.mp3");
    let playMove = moveSound.play();
    if (playMove !== undefined) {
        playMove
            .then(function () {})
            .catch(function (error) {
                console.log("Failed to load move sound");
            });
    }
}

export { playCaptureSound, playMoveSound, playOutOfBoundSound, playEndGame };
