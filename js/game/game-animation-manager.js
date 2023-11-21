const MOVE_DIRECTIONS_ENUM = {
    forward: 0,
    right: 1,
    backward: 2,
    left: 3,
};

const moveAnimationNames = [
    "dynamicForwadMove",
    "dynamicRightMove",
    "dynamicBackwardMove",
    "dynamicLeftMove",
];

class GameAnimationManager {
    constructor() {}

    animatePopUp(dom) {
        if (dom === null || dom === undefined) return;

        dom.style.animationName = "pop";
        dom.style.animationDuration = "0.5s";

        dom.addEventListener("animationend", function () {
            dom.style.animationName = "";
            dom.style.animationDuration = "";
        });
    }
}
