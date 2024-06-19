let startX, startY;
let gameBody = document.querySelector(".game__body");
let isTouchInGameBody = false;

document.addEventListener("keydown", function (event) {
    if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
            event.code
        ) > -1
    ) {
        event.preventDefault();
    }
});

//disables scrolling on focus drag on gameBody
gameBody.addEventListener("touchmove", (event) => {
    if (isTouchInGameBody) event.preventDefault();
});

gameBody.addEventListener("touchstart", (event) => {
    isTouchInGameBody = true;
    let lastTouch = event.touches.length - 1;

    startX = event.touches[lastTouch].clientX;
    startY = event.touches[lastTouch].clientY;
});

gameBody.addEventListener("touchend", (event) => {
    isTouchInGameBody = false;

    if (!startX || !startY) {
        return; // Touchstart event not registered
    }

    let lastTouch = event.changedTouches.length - 1;
    let endX = event.changedTouches[lastTouch].clientX;
    let endY = event.changedTouches[lastTouch].clientY;

    let deltaX = endX - startX;
    let deltaY = endY - startY;

    // Determine the direction based on the difference in coordinates
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > -1) {
            simulateArrowKeyPress("ArrowRight");
        } else {
            simulateArrowKeyPress("ArrowLeft");
        }
    } else {
        if (deltaY > -1) {
            simulateArrowKeyPress("ArrowDown");
        } else {
            simulateArrowKeyPress("ArrowUp");
        }
    }

    // Reset start coordinates
    startX = startY = null;
});

function simulateArrowKeyPress(keyCode) {
    const downEvent = new KeyboardEvent("keydown", {
        key: keyCode,
        code: keyCode,
        keyCode: keyCode.charCodeAt(0),
        which: keyCode.charCodeAt(0),
        bubbles: true,
        cancelable: true,
    });

    document.dispatchEvent(downEvent);

    const upEvent = new KeyboardEvent("keyup", {
        key: keyCode,
        code: keyCode,
        keyCode: keyCode.charCodeAt(0),
        which: keyCode.charCodeAt(0),
        bubbles: true,
        cancelable: true,
    });

    document.dispatchEvent(upEvent);
}
