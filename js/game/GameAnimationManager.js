const MOVE_DIRECTIONS_ENUM = {
    forward: 0,
    right: 1,
    backward: 2,
    left: 3,
};

const moveAnimationNames = [
    "ForwadMove",
    "RightMove",
    "BackwardMove",
    "LeftMove",
];

const dynamicAnimationPrefix = "dynamic";
const popAnimationName = "pop";

class GameAnimationManager {
    constructor() {
        this.dynamicStyleDom = document.createElement("style");
        document.head.appendChild(this.dynamicStyleDom);
        this.storedAnimationNames = [];
        this.gameAnimationAttachmentsManager =
            new GameAnimationAttachmentsManager();
    }

    getAnimationAttachmentsManager() {
        return this.gameAnimationAttachmentsManager;
    }

    animatePopUp(dom) {
        if (dom === null || dom === undefined) return;

        this.getAnimationAttachmentsManager().attachAnimation(
            dom,
            new GameAnimationAttachment(popAnimationName, "0.05s")
        );
    }

    startMoveAnimation(moveEnum, toCubeDom, fromCubeDom) {
        const animationPrefix = this.getMoveAnimationPrefix(moveEnum);
        const distanceInAxis = this.getMoveAxisDifference(
            toCubeDom,
            fromCubeDom
        );
        const animationName = animationPrefix + "-" + distanceInAxis;

        this.getAnimationAttachmentsManager().attachAnimation(
            fromCubeDom,
            new GameAnimationAttachment(animationName, "0.1s")
        );

        if (!this.hasStoredAnimation(animationName)) {
            let keyFrames = this.getMoveAnimationFrames(
                moveEnum,
                animationName,
                distanceInAxis
            );

            this.tryInjectingKeyFrames(keyFrames, animationName);
        }
    }

    tryStartingNextAnimation(dom) {
        this.getAnimationAttachmentsManager().startAttachedAnimation(dom);
    }

    hasStoredAnimation(animationName) {
        const totalAnimationNames = this.storedAnimationNames.length;

        for (
            let currentNameIndex = 0;
            currentNameIndex < totalAnimationNames;
            currentNameIndex++
        ) {
            if (this.storedAnimationNames[currentNameIndex] === animationName) {
                return true;
            }
        }

        return false;
    }

    tryInjectingKeyFrames(keyFrames, name) {
        if (this.hasStoredAnimation(name)) return;

        this.dynamicStyleDom.innerHTML += keyFrames;
        this.storedAnimationNames.push(name);
    }

    getMoveAnimationPrefix(moveEnum) {
        switch (moveEnum) {
            case MOVE_DIRECTIONS_ENUM.forward:
                return (
                    dynamicAnimationPrefix +
                    moveAnimationNames[MOVE_DIRECTIONS_ENUM.forward]
                );
            case MOVE_DIRECTIONS_ENUM.right:
                return (
                    dynamicAnimationPrefix +
                    moveAnimationNames[MOVE_DIRECTIONS_ENUM.right]
                );
            case MOVE_DIRECTIONS_ENUM.backward:
                return (
                    dynamicAnimationPrefix +
                    moveAnimationNames[MOVE_DIRECTIONS_ENUM.backward]
                );
            case MOVE_DIRECTIONS_ENUM.left:
                return (
                    dynamicAnimationPrefix +
                    moveAnimationNames[MOVE_DIRECTIONS_ENUM.left]
                );
            default:
                return (
                    dynamicAnimationPrefix +
                    moveAnimationNames[MOVE_DIRECTIONS_ENUM.left]
                );
        }
    }

    getMoveAnimationFrames(moveEnum, animationName, distance) {
        switch (moveEnum) {
            case MOVE_DIRECTIONS_ENUM.forward: {
                return this.getMoveVerticalFrames(animationName, distance);
            }
            case MOVE_DIRECTIONS_ENUM.backward: {
                return this.getMoveVerticalFrames(animationName, distance);
            }
            case MOVE_DIRECTIONS_ENUM.right: {
                return this.getMoveHorizontalFrames(animationName, distance);
            }
            case MOVE_DIRECTIONS_ENUM.left: {
                return this.getMoveHorizontalFrames(animationName, distance);
            }
            default:
                return null;
        }
    }

    getMoveAxisDifference(toDom, fromDom) {
        const distance = this.getPositionDifference(toDom, fromDom);

        if (distance.deltaX !== 0) return distance.deltaX;
        else return distance.deltaY;
    }

    getPositionDifference(toDom, fromDom) {
        const rect1 = fromDom.getBoundingClientRect();
        const rect2 = toDom.getBoundingClientRect();

        const deltaX = rect2.left - rect1.left;
        const deltaY = rect2.top - rect1.top;

        return { deltaX, deltaY };
    }

    getMoveVerticalFrames(animationName, distance) {
        return `
        @keyframes ${animationName} {
            0% { transform: translateY(0); }
            100% { transform: translateY(${distance}px); }
        }
    `;
    }

    getMoveHorizontalFrames(animationName, distance) {
        return `
        @keyframes ${animationName} {
            0% { transform: translateX(0); }
            100% { transform: translateX(${distance}px); }
        }
    `;
    }
}
