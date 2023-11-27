let mapDom = document.querySelector("#game-map");
let newGameButtonDom = document.querySelector("#btn-new-game");
let currentScoreDom = document.querySelector("#current-score");
let bestScoreDom = document.querySelector("#best-score");

let gameMenuWinDom = document.querySelector("#game-menu-win");
let gameMenuLoseDom = document.querySelector("#game-menu-lose");

let gameManager = new GameManager(
    mapDom,
    newGameButtonDom,
    currentScoreDom,
    bestScoreDom,
    gameMenuWinDom,
    gameMenuLoseDom
);

let howToDom = document.querySelector(".how-to");
let howToBtnDom = document.querySelector(".info__tutorial__btn");

howToBtnDom.addEventListener("click", function () {
    if (howToDom.classList.contains("d-none")) {
        howToDom.classList.remove("d-none");
    } else howToDom.classList.add("d-none");
    console.log("hi");
});
