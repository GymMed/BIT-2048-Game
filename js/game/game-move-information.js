class MoveInformation {
    constructor(moveToY, moveToX, fromY, fromX, merge = false) {
        this.moveToY = moveToY;
        this.moveToX = moveToX;
        this.fromY = fromY;
        this.fromX = fromX;
        this.merge = merge;
    }

    getMoveY() {
        return this.moveToY;
    }

    getMoveX() {
        return this.moveToX;
    }

    getFromY() {
        return this.fromY;
    }

    getFromX() {
        return this.fromX;
    }

    isMerged() {
        return this.merge;
    }
}
