const app = document.getElementById("app");

let selectedMode = null;
let playerSymbol = null;

function renderHome() {
  app.innerHTML = `
    <h1 class="title">Tic-Tac-Toe</h1>

    <div class="menu">
      <button id="vs-computer">Vs Computer</button>
      <button id="vs-player">2 Players</button>
    </div>
  `;

  document.getElementById("vs-computer").addEventListener("click", () => {
    selectedMode = "computer";
    renderSymbolSelection();
  });

  document.getElementById("vs-player").addEventListener("click", () => {
    selectedMode = "player";
    renderSymbolSelection();
  });
}

function renderSymbolSelection() {
  app.innerHTML = `
    <h1 class="title">Choose your symbol</h1>

    <div class="choice">
      <button id="choose-x">X</button>
      <button id="choose-o">O</button>
    </div>
  `;

  document.getElementById("choose-x").addEventListener("click", () => {
    playerSymbol = "X";
    renderBoard();
  });

  document.getElementById("choose-o").addEventListener("click", () => {
    playerSymbol = "O";
    renderBoard();
  });
}

function renderBoard() {
  app.innerHTML = `
    <h1 class="title">Game Board</h1>

    <div class="board">
      ${Array(9)
        .fill("")
        .map((_, index) => `<div class="cell" data-index="${index}"></div>`)
        .join("")}
    </div>
  `;

  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      console.log("Clicked cell:", cell.dataset.index);
    });
  });
}

// inicialização
renderHome();