const MAP_AXIS_ENUM = {
    y: 0,
    x: 1,
};

const emptyPosition = -1;
let currentScore = 0;

class GameMap {
    constructor(
        mapDom,
        moveAnimationsEndTrigger,
        popUpAnimationsEndTrigger,
        width = 4,
        height = 4
    ) {
        this.width = width;
        this.height = height;
        this.mapDom = mapDom;

        this.availableSpace = [];
        this.gameAnimationManager = new GameAnimationManager();

        this.fillAvailableSpace();

        if (
            typeof moveAnimationsEndTrigger === "function" &&
            typeof popUpAnimationsEndTrigger === "function"
        ) {
            this.allMoveAnimationEndEvent = new CustomEvent(
                "allMoveAnimationsEnd",
                {}
            );
            this.allPopUpAnimationsEndEvent = new CustomEvent(
                "allPopUpAnimationsEnd",
                {}
            );

            this.totalPopUpsStart = 0;
            this.totalPopUpsEnd = 0;
            this.popUpAnimationsEndTrigger = popUpAnimationsEndTrigger;

            this.totalMoveAnimationsStart = 0;
            this.totalMoveAnimationsEnd = 0;
            this.moveAnimationsEndTrigger = moveAnimationsEndTrigger;

            this.addAnimationsListenersForMap();
        }
    }

    addAnimationsListenersForMap() {
        this.mapDom.addEventListener("allMoveAnimationsEnd", () => {
            this.totalMoveAnimationsStart = 0;
            this.totalMoveAnimationsEnd = 0;
            this.moveAnimationsEndTrigger();
        });

        this.mapDom.addEventListener("allPopUpAnimationsEnd", () => {
            this.totalPopUpsStart = 0;
            this.totalPopUpsEnd = 0;
            this.popUpAnimationsEndTrigger();
        });
    }

    getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    fillAvailableSpace() {
        let column = 0;
        let cubeDom = null;

        for (let row = 0; row < this.height; row++) {
            this.availableSpace[row] = [];

            for (column = 0; column < this.width; column++) {
                this.availableSpace[row][column] = emptyPosition;
                cubeDom = this.getGameMapCoordinateDom(row, column);

                cubeDom.addEventListener(
                    "animationend",
                    this.animationEndListener.bind(this)
                );
            }
        }
    }

    animationEndListener(event) {
        event.currentTarget.style.animationName = "";
        event.currentTarget.style.animationDuration = "";

        if (event.animationName == popAnimationName) {
            this.popHandler();
            this.getAnimationManager().tryStartingNextAnimation(
                event.currentTarget
            );
            return;
        }

        if (
            event.currentTarget.moveInformation === undefined ||
            !(event.currentTarget.moveInformation instanceof MoveInformation) ||
            !event.animationName.includes(dynamicAnimationPrefix)
        ) {
            this.getAnimationManager().tryStartingNextAnimation(
                event.currentTarget
            );
            return;
        }

        let moveInformation = event.currentTarget.moveInformation;

        if (moveInformation.isMerged()) {
            this.mergeHandler(moveInformation);
        } else {
            this.moveHandler(moveInformation);
        }
        this.getAnimationManager().tryStartingNextAnimation(
            event.currentTarget
        );
    }

    popHandler() {
        this.totalPopUpsEnd++;

        if (this.totalPopUpsEnd === this.totalPopUpsStart)
            this.getGameMapDom().dispatchEvent(this.allPopUpAnimationsEndEvent);
    }

    moveHandler(moveInformation) {
        if (
            this.availableSpace[moveInformation.getMoveY()][
                moveInformation.getMoveX()
            ] !== emptyPosition
        )
            this.makeCubeDom(
                cubesByType[
                    this.availableSpace[moveInformation.getMoveY()][
                        moveInformation.getMoveX()
                    ]
                ],
                moveInformation.getMoveY(),
                moveInformation.getMoveX()
            );

        this.totalMoveAnimationsEnd++;

        if (
            this.availableSpace[moveInformation.getFromY()][
                moveInformation.getFromX()
            ] === emptyPosition
        )
            this.removeCubeDom(
                moveInformation.getFromY(),
                moveInformation.getFromX()
            );

        if (this.totalMoveAnimationsEnd === this.totalMoveAnimationsStart)
            // has to dispatch before removal
            this.getGameMapDom().dispatchEvent(this.allMoveAnimationEndEvent);
    }

    mergeHandler(moveInformation) {
        this.upgradeCoordinatesDom(
            moveInformation.getMoveY(),
            moveInformation.getMoveX()
        );
        if (
            this.availableSpace[moveInformation.getFromY()][
                moveInformation.getFromX()
            ] == emptyPosition
        )
            this.removeCubeDom(
                moveInformation.getFromY(),
                moveInformation.getFromX()
            );

        GameScoreBoard.increaseScore(
            cubesByType[
                this.availableSpace[moveInformation.getMoveY()][
                    moveInformation.getMoveX()
                ]
            ].getValue()
        );

        this.totalMoveAnimationsEnd++;

        if (this.totalMoveAnimationsEnd === this.totalMoveAnimationsStart)
            this.getGameMapDom().dispatchEvent(this.allMoveAnimationEndEvent);
    }

    restart(spawnAmount = 2) {
        let currentX = 0;

        for (let currentY = 0; currentY < this.height; currentY++) {
            this.availableSpace[currentY] = [];

            for (currentX = 0; currentX < this.width; currentX++) {
                if (this.availableSpace[currentY][currentX] != emptyPosition) {
                    this.removeCube(currentY, currentX);
                }
            }
        }

        if (spawnAmount > 0) this.spawnCubes(spawnAmount);
    }

    isLost() {
        let minusOneHeight = this.height - 1;
        let minusOneWidth = this.width - 1;
        let currentColumn = 0;

        for (let currentRow = 0; currentRow < minusOneHeight; currentRow++) {
            for (
                currentColumn = 0;
                currentColumn < minusOneWidth;
                currentColumn++
            ) {
                if (
                    this.availableSpace[currentRow][currentColumn] ==
                        emptyPosition ||
                    this.availableSpace[currentRow][currentColumn + 1] ==
                        emptyPosition ||
                    this.availableSpace[currentRow + 1][currentColumn] ==
                        emptyPosition ||
                    this.canUpgrade(
                        this.availableSpace[currentRow][currentColumn],
                        this.availableSpace[currentRow][currentColumn + 1]
                    ) ||
                    this.canUpgrade(
                        this.availableSpace[currentRow][currentColumn],
                        this.availableSpace[currentRow + 1][currentColumn]
                    )
                ) {
                    return false;
                }
            }
        }

        for (
            currentColumn = 0;
            currentColumn < minusOneWidth;
            currentColumn++
        ) {
            if (
                this.availableSpace[minusOneHeight][currentColumn] ==
                    emptyPosition ||
                this.availableSpace[minusOneHeight][currentColumn + 1] ==
                    emptyPosition ||
                this.canUpgrade(
                    this.availableSpace[minusOneHeight][currentColumn],
                    this.availableSpace[minusOneHeight][currentColumn + 1]
                )
            ) {
                return false;
            }
        }

        return true;
    }

    moveUp() {
        let currentRow = 0;
        const notFreeRowIndex = 9999;
        let freeRow = notFreeRowIndex;
        let merged = false;
        let spaceType = emptyPosition;
        let triggeredAnimation = false;

        for (
            let currentColumn = 0;
            currentColumn < this.width;
            currentColumn++
        ) {
            freeRow = notFreeRowIndex;
            merged = false;

            for (currentRow = 0; currentRow < this.height; currentRow++) {
                spaceType = this.availableSpace[currentRow][currentColumn];

                if (spaceType == emptyPosition) {
                    if (freeRow > currentRow) {
                        freeRow = currentRow;
                    }
                } else {
                    if (currentRow == 0) continue;

                    if (!merged) {
                        if (
                            freeRow > 0 &&
                            this.tryMergingCoordinates(
                                freeRow - 1,
                                currentColumn,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        } else if (
                            this.tryMergingCoordinates(
                                currentRow - 1,
                                currentColumn,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            freeRow = currentRow;
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        }
                    }

                    if (freeRow < currentRow) {
                        this.moveCubeToCoordinates(
                            freeRow,
                            currentColumn,
                            currentRow,
                            currentColumn
                        );
                        freeRow++;
                        merged = false;
                        triggeredAnimation = true;
                    }
                }
            }
        }

        if (!triggeredAnimation) {
            this.getGameMapDom().dispatchEvent(this.allPopUpAnimationsEndEvent);
        }
    }

    moveRight() {
        let currentColumn = 0;
        const notFreeColumnIndex = -9999;
        let freeColumn = notFreeColumnIndex;
        let merged = false;
        let spaceType = emptyPosition;
        let minusOneWidth = this.width - 1;
        let triggeredAnimation = false;

        for (let currentRow = 0; currentRow < this.height; currentRow++) {
            freeColumn = notFreeColumnIndex;
            merged = false;

            for (
                currentColumn = minusOneWidth;
                currentColumn > -1;
                currentColumn--
            ) {
                spaceType = this.availableSpace[currentRow][currentColumn];

                if (spaceType == emptyPosition) {
                    if (freeColumn < currentColumn) {
                        freeColumn = currentColumn;
                    }
                } else {
                    if (currentColumn == minusOneWidth) continue;

                    if (!merged) {
                        if (
                            freeColumn < minusOneWidth &&
                            this.tryMergingCoordinates(
                                currentRow,
                                freeColumn + 1,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        } else if (
                            this.tryMergingCoordinates(
                                currentRow,
                                currentColumn + 1,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            freeColumn = currentColumn;
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        }
                    }

                    if (freeColumn > currentColumn) {
                        this.moveCubeToCoordinates(
                            currentRow,
                            freeColumn,
                            currentRow,
                            currentColumn
                        );
                        freeColumn--;
                        merged = false;
                        triggeredAnimation = true;
                    }
                }
            }
        }

        if (!triggeredAnimation) {
            this.getGameMapDom().dispatchEvent(this.allPopUpAnimationsEndEvent);
        }
    }

    moveDown() {
        let currentRow = 0;
        const notFreeRowIndex = -9999;
        let freeRow = notFreeRowIndex;
        let merged = false;
        let spaceType = emptyPosition;
        let minusOneHeight = this.height - 1;
        let triggeredAnimation = false;

        for (
            let currentColumn = 0;
            currentColumn < this.width;
            currentColumn++
        ) {
            freeRow = notFreeRowIndex;
            merged = false;

            for (currentRow = minusOneHeight; currentRow > -1; currentRow--) {
                spaceType = this.availableSpace[currentRow][currentColumn];

                if (spaceType == emptyPosition) {
                    if (freeRow < currentRow) {
                        freeRow = currentRow;
                    }
                } else {
                    if (currentRow == minusOneHeight) continue;

                    if (!merged) {
                        if (
                            freeRow < minusOneHeight &&
                            this.tryMergingCoordinates(
                                freeRow + 1,
                                currentColumn,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        } else if (
                            this.tryMergingCoordinates(
                                currentRow + 1,
                                currentColumn,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            freeRow = currentRow;
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        }
                    }

                    if (freeRow > currentRow) {
                        this.moveCubeToCoordinates(
                            freeRow,
                            currentColumn,
                            currentRow,
                            currentColumn
                        );
                        freeRow--;
                        merged = false;
                        triggeredAnimation = true;
                    }
                }
            }
        }

        if (!triggeredAnimation) {
            this.getGameMapDom().dispatchEvent(this.allPopUpAnimationsEndEvent);
        }
    }

    moveLeft() {
        let currentColumn = 0;
        const notFreeColumnIndex = 9999;
        let freeColumn = notFreeColumnIndex;
        let merged = false;
        let spaceType = emptyPosition;
        let triggeredAnimation = false;

        for (let currentRow = 0; currentRow < this.height; currentRow++) {
            freeColumn = notFreeColumnIndex;
            merged = false;

            for (
                currentColumn = 0;
                currentColumn < this.width;
                currentColumn++
            ) {
                spaceType = this.availableSpace[currentRow][currentColumn];

                if (spaceType == emptyPosition) {
                    if (freeColumn > currentColumn) {
                        freeColumn = currentColumn;
                    }
                } else {
                    if (currentColumn == 0) continue;

                    if (!merged) {
                        if (
                            freeColumn > 0 &&
                            this.tryMergingCoordinates(
                                currentRow,
                                freeColumn - 1,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        } else if (
                            this.tryMergingCoordinates(
                                currentRow,
                                currentColumn - 1,
                                currentRow,
                                currentColumn
                            )
                        ) {
                            freeColumn = currentColumn;
                            merged = true;
                            triggeredAnimation = true;
                            continue;
                        }
                    }

                    if (freeColumn < currentColumn) {
                        this.moveCubeToCoordinates(
                            currentRow,
                            freeColumn,
                            currentRow,
                            currentColumn
                        );
                        freeColumn++;
                        merged = false;
                        triggeredAnimation = true;
                    }
                }
            }
        }

        if (!triggeredAnimation) {
            this.getGameMapDom().dispatchEvent(this.allPopUpAnimationsEndEvent);
        }
    }

    moveCubeToCoordinates(moveToY, moveToX, fromY, fromX) {
        this.animateMoveCube(moveToY, moveToX, fromY, fromX);

        this.availableSpace[moveToY][moveToX] =
            cubesByType[this.availableSpace[fromY][fromX]].getType();
        this.availableSpace[fromY][fromX] = emptyPosition;
        const fromCubeDom = this.getGameMapCoordinateDom(fromY, fromX);

        fromCubeDom.moveInformation = new MoveInformation(
            moveToY,
            moveToX,
            fromY,
            fromX,
            false
        );
    }

    tryMergingCoordinates(mergToY, mergToX, fromY, fromX) {
        if (
            mergToY < this.height &&
            mergToY > -1 &&
            mergToX < this.width &&
            mergToX > -1 &&
            fromY < this.height &&
            fromY > -1 &&
            fromX < this.width &&
            fromX > -1 &&
            this.canUpgrade(
                this.availableSpace[mergToY][mergToX],
                this.availableSpace[fromY][fromX]
            )
        ) {
            this.animateMoveCube(mergToY, mergToX, fromY, fromX);

            const upgradedCube =
                cubesByType[
                    this.availableSpace[mergToY][mergToX]
                ].getUpgradedCube();
            this.availableSpace[mergToY][mergToX] = upgradedCube.getType();
            this.availableSpace[fromY][fromX] = emptyPosition;

            const fromCubeDom = this.getGameMapCoordinateDom(fromY, fromX);
            fromCubeDom.moveInformation = new MoveInformation(
                mergToY,
                mergToX,
                fromY,
                fromX,
                true
            );

            return true;
        }

        return false;
    }

    upgradeCoordinates(row, column) {
        const upgradedCube =
            cubesByType[this.availableSpace[row][column]].getUpgradedCube();

        this.removeCube(row, column);
        this.makeCube(upgradedCube, row, column);
        this.animatePopUpCube(row, column);
    }

    upgradeCoordinatesDom(row, column) {
        const upgradedCube = cubesByType[this.availableSpace[row][column]];

        //this.removeCubeDom(row, column);
        this.makeCubeDom(upgradedCube, row, column);
        this.animatePopUpCube(row, column);
    }

    canUpgrade(mergeToSpaceColumnType, currentSpaceColumnType) {
        if (
            mergeToSpaceColumnType == currentSpaceColumnType &&
            mergeToSpaceColumnType !== emptyPosition
        )
            return true;

        return false;
    }

    spawnCubes(amount) {
        let freeRows = this.getFreeRows();
        let freeColumnsCount = this.getFreeColumnCount(freeRows);

        if (freeColumnsCount == 0 || amount > freeColumnsCount) return null;

        let freeRowsCount = freeRows.length;
        let currentRowCount = 0;
        let randomRowIndex = 0;
        let randomColumnIndex = 0;
        let randomRow = null;
        let randomColumn = null;
        let columns = [];

        for (let currentSpawn = 0; currentSpawn < amount; currentSpawn++) {
            randomRowIndex = this.getRandomIntInclusive(0, freeRowsCount - 1);
            randomRow = freeRows[randomRowIndex];
            columns = randomRow.getColumns();

            randomColumnIndex = this.getRandomIntInclusive(
                0,
                columns.length - 1
            );
            randomColumn = columns[randomColumnIndex];
            currentRowCount = randomRow.getCount();

            if (currentRowCount == 1) {
                freeRows.splice(randomRowIndex, 1);
                freeRowsCount--;
            } else {
                columns.splice(randomColumnIndex, 1);
                freeRows[randomRowIndex].setColumns(columns);
                freeRows[randomRowIndex].setCount(currentRowCount - 1);
            }

            this.spawnCube(randomColumn.getY(), randomColumn.getX());
        }
    }

    spawnCube(y, x) {
        let randomType = this.getRandomCube();

        this.makeCube(randomType, y, x);
        this.animatePopUpCube(y, x);
    }

    makeCube(cubeByType, y, x) {
        this.makeCubeDom(cubeByType, y, x);
        this.availableSpace[y][x] = cubeByType.getType();
    }

    makeCubeDom(cubeByType, y, x) {
        let coordinateDom = this.getGameMapCoordinateDom(y, x);
        coordinateDom.textContent = cubeByType.getValue();
        coordinateDom.className =
            cubeDomDefaultClassList +
            cubeByType.getBgColor() +
            " " +
            cubeByType.getTextColor();
    }

    animatePopUpCube(y, x) {
        let coordinateDom = this.getGameMapCoordinateDom(y, x);
        this.totalPopUpsStart++;
        this.getAnimationManager().animatePopUp(coordinateDom);
    }

    animateMoveCube(toY, toX, fromY, fromX) {
        let toDom = this.getGameMapCoordinateDom(toY, toX);
        let fromDom = this.getGameMapCoordinateDom(fromY, fromX);

        if (
            toDom === undefined ||
            toDom === null ||
            fromDom === undefined ||
            fromDom === null
        )
            return;

        let moveEnum = null;

        if (toY < fromY) moveEnum = MOVE_DIRECTIONS_ENUM.backward;
        else if (toY > fromY) moveEnum = MOVE_DIRECTIONS_ENUM.forward;
        else if (toX < fromX) moveEnum = MOVE_DIRECTIONS_ENUM.left;
        else moveEnum = MOVE_DIRECTIONS_ENUM.right;

        this.totalMoveAnimationsStart++;
        this.getAnimationManager().startMoveAnimation(moveEnum, toDom, fromDom);
    }

    removeCube(y, x) {
        this.removeCubeDom(y, x);
        this.availableSpace[y][x] = emptyPosition;
    }

    removeCubeDom(y, x) {
        let coordinateDom = this.getGameMapCoordinateDom(y, x);

        coordinateDom.textContent = "";
        coordinateDom.className = cubeDomDefaultClassList;
    }

    getRandomCube() {
        if (currentScore > 4) {
            let randomType = this.getRandomIntInclusive(0, 1);

            if (randomType == 1) {
                return cubesByType[CUBE_TYPES_ENUM.four];
            }
        }

        return cubesByType[CUBE_TYPES_ENUM.two];
    }

    getFreeColumnCount(freeRowsArray) {
        let totalFreeColumns = 0;
        const totalRows = freeRowsArray.length;

        if (totalRows < 1) return totalFreeColumns;

        for (let row = 0; row < totalRows; row++) {
            totalFreeColumns += freeRowsArray[row].getCount();
        }

        return totalFreeColumns;
    }

    getFreeRows() {
        let freeRows = [];

        for (let row = 0; row < this.height; row++) {
            let currentRow = this.getFreeColumsCount(row);

            if (currentRow.getCount() > 0) freeRows.push(currentRow);
        }

        return freeRows;
    }

    getFreeColumsCount(row) {
        let totalFreeColumns = 0;
        let positions = [];

        for (let column = 0; column < this.width; column++) {
            if (this.availableSpace[row][column] == emptyPosition) {
                positions.push(new GameMapColumn(row, column));
                totalFreeColumns++;
            }
        }
        return new GameMapRow(totalFreeColumns, positions);
    }

    getAnimationManager() {
        return this.gameAnimationManager;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getGameMapDom() {
        return this.mapDom;
    }

    getGameMapRowDom(row) {
        let mapChildren = this.mapDom.children;

        if (mapChildren.length - 1 < row || row < 0) return null;

        return mapChildren[row];
    }

    getGameMapCoordinateDom(row, column) {
        let mapRow = this.getGameMapRowDom(row);

        if (mapRow === null) return null;

        let mapRowColumns = mapRow.children;

        if (mapRowColumns.length - 1 < column || column < 0) return null;

        return mapRowColumns[column];
    }
}
