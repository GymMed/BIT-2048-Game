let mapDom = document.querySelector("#game-map");
let newGameButtonDom = document.querySelector("#btn-new-game");
let currentScoreDom = document.querySelector("#current-score");
let bestScoreDom = document.querySelector("#best-score");

let gameMenuWin = document.querySelector("#game-menu-win");
let gameMenuLose = document.querySelector("#game-menu-lose");

//gameMenuWin.style.display = "none";

let gameManager = new GameManager(
    mapDom,
    newGameButtonDom,
    currentScoreDom,
    bestScoreDom
);
