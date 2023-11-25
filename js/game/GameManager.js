const GAME_STATE_ENUM = {
    running: 0,
    stopped: 1,
    animating: 2,
};

class GameManager {
    constructor(
        mapDom,
        newGameButtonDom,
        currentScoreDom,
        bestScoreDom,
        gameMenuWinDom,
        gameMenuLoseDom
    ) {
        this.state = GAME_STATE_ENUM.running;
        this.scoreBoard = new GameScoreBoard(currentScoreDom, bestScoreDom);
        this.gameMap = new GameMap(
            mapDom,
            this.moveEndAnimations.bind(this),
            this.popUpEndAnimations.bind(this)
        );
        this.hasEndedMoveAnimations = false;

        this.newGameButtonDom = newGameButtonDom;
        this.gameMenuWinDom = gameMenuWinDom;
        this.gameMenuLoseDom = gameMenuLoseDom;

        this.gameMap.spawnCubes(12);

        this.handleKeyInput = this.handleKeyInput.bind(this);
        this.moveCubesLeft = this.moveCubesLeft.bind(this);

        document.addEventListener("keyup", this.handleKeyInput);

        this.handleNewGameClick = this.handleNewGameClick.bind(this);
        newGameButtonDom.addEventListener("click", this.handleNewGameClick);
        this.initGameScreens();
    }

    initGameScreens() {
        this.hideLoseDom();
        this.hideWinDom();

        let winTryAgainBtnDom =
            this.gameMenuWinDom.querySelector("#btn-win-try-again");
        let loseTryAgainBtnDom = this.gameMenuLoseDom.querySelector(
            "#btn-lose-try-again"
        );
        let keepGoingBtnDom =
            this.gameMenuWinDom.querySelector("#btn-keep-going");

        winTryAgainBtnDom.addEventListener("click", () => {
            this.restart();
        });

        loseTryAgainBtnDom.addEventListener("click", () => {
            this.restart();
        });

        keepGoingBtnDom.addEventListener("click", () => {
            this.hideWinDom();
        });
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
                    this.restart();
                }
                break;
            }
        }
    }

    turnEnd() {}

    moveEndAnimations() {
        this.hasEndedMoveAnimations = true;

        if (this.gameMap.spawnCubes(1) === null && this.gameMap.isLost()) {
            this.lose();
        }
    }

    popUpEndAnimations() {
        if (this.hasEndedMoveAnimations && this.gameMap.isLost()) this.lose();

        if (this.state === GAME_STATE_ENUM.animating)
            this.state = GAME_STATE_ENUM.running;
    }

    win() {
        //needs implementation on 2048 merge
        console.log("You won!");
        this.showWinDom();
    }

    lose() {
        console.log("You lose! You are out of moves!");
        this.showLoseDom();
    }

    restart() {
        this.gameMap.restart();
        this.state = GAME_STATE_ENUM.running;

        this.hideLoseDom();
        this.hideWinDom();
    }

    handleKeyInput(event) {
        switch (this.state) {
            case GAME_STATE_ENUM.running: {
                this.state = GAME_STATE_ENUM.animating;
                this.hasEndedMoveAnimations = false;
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

    showLoseDom() {
        if (this.gameMenuLoseDom.classList.contains("d-none")) {
            this.state = GAME_STATE_ENUM.stopped;
            this.gameMenuLoseDom.classList.remove("d-none");
        }
    }

    showWinDom() {
        if (this.gameMenuWinDom.classList.contains("d-none")) {
            this.state = GAME_STATE_ENUM.stopped;
            this.gameMenuWinDom.classList.remove("d-none");
        }
    }

    hideLoseDom() {
        if (!this.gameMenuLoseDom.classList.contains("d-none")) {
            this.state = GAME_STATE_ENUM.running;
            this.gameMenuLoseDom.classList.add("d-none");
        }
    }

    hideWinDom() {
        if (!this.gameMenuWinDom.classList.contains("d-none")) {
            this.state = GAME_STATE_ENUM.running;
            this.gameMenuWinDom.classList.add("d-none");
        }
    }
}
