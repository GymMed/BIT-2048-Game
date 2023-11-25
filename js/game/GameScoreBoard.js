class GameScoreBoard {
    static currentScore = 0;
    static bestScore = 0;
    static bestScoreStorageName = "best-score";

    constructor(currentScoreDom, bestScoreDom) {
        GameScoreBoard.currentScoreDom = currentScoreDom;
        GameScoreBoard.bestScoreDom = bestScoreDom;
        let retrievedBestScore = LocalStorageManager.getData(
            GameScoreBoard.bestScoreStorageName
        );

        if (retrievedBestScore !== null && retrievedBestScore !== undefined)
            GameScoreBoard.setBestScore(retrievedBestScore);
    }

    static increaseScore(amount) {
        amount = parseInt(amount);
        GameScoreBoard.setCurrentScore(
            parseInt(GameScoreBoard.currentScore) + amount
        );

        if (GameScoreBoard.currentScore > GameScoreBoard.bestScore) {
            GameScoreBoard.setBestScore(GameScoreBoard.currentScore);
        }
    }

    static setCurrentScore(amount) {
        GameScoreBoard.currentScore = amount;
        GameScoreBoard.currentScoreDom.textContent = amount;
    }

    static setBestScore(amount) {
        GameScoreBoard.bestScore = amount;
        GameScoreBoard.bestScoreDom.textContent = amount;
        LocalStorageManager.storeData(
            GameScoreBoard.bestScoreStorageName,
            amount
        );
    }
}
