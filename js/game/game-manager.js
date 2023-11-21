const GAME_STATE_ENUM = {
    running: 0,
    stopped: 1,
    animating: 2,
};

class GameManager {
    constructor(mapDom, newGameButtonDom, currentScoreDom, bestScoreDom) {
        this.state = GAME_STATE_ENUM.running;
        this.scoreBoard = new GameScoreBoard(currentScoreDom, bestScoreDom);
        this.gameMap = new GameMap(mapDom);
        this.newGameButtonDom = newGameButtonDom;

        this.gameMap.spawnCubes(12);

        this.handleKeyInput = this.handleKeyInput.bind(this);
        this.moveCubesLeft = this.moveCubesLeft.bind(this);

        document.addEventListener("keyup", this.handleKeyInput);

        this.handleNewGameClick = this.handleNewGameClick.bind(this);
        newGameButtonDom.addEventListener("click", this.handleNewGameClick);
    }

    handleNewGameClick(event) {
        switch (this.state) {
            //add other state interactions in future!
            default: {
                if (
                    confirm(
                        "Are you sure you want to start a new game? All progress will be lost."
                    )
                ) {
                    this.gameMap.restart();
                    this.state = GAME_STATE_ENUM.running;
                }
                break;
            }
        }
    }

    turnEnd() {
        if (this.gameMap.spawnCubes(1) === null && this.gameMap.isLost()) {
            this.lose();
        }
    }

    lose() {
        console.log("You lose! You are out of moves!");
    }

    handleKeyInput(event) {
        switch (this.state) {
            case GAME_STATE_ENUM.running: {
                this.handleRunningKeyInput(event);
                break;
            }
            default: {
                break;
            }
        }
    }

    handleRunningKeyInput(event) {
        switch (event.key) {
            case "ArrowUp": {
                this.moveCubesUp();
                break;
            }
            case "ArrowRight": {
                this.moveCubesRight();
                break;
            }
            case "ArrowDown": {
                this.moveCubesDown();
                break;
            }
            case "ArrowLeft": {
                this.moveCubesLeft();
                break;
            }
            default:
                return;
        }
    }

    moveCubesUp() {
        this.gameMap.moveUp();
        this.turnEnd();
    }

    moveCubesRight() {
        this.gameMap.moveRight();
        this.turnEnd();
    }

    moveCubesDown() {
        this.gameMap.moveDown();
        this.turnEnd();
    }

    moveCubesLeft() {
        this.gameMap.moveLeft();
        this.turnEnd();
    }
}
