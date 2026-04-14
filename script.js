const app = document.getElementById("app");

let selectedMode = null;
let playerSymbol = null;
let currentPlayer = "X";
let board = Array(9).fill("");

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
    startGame();
  });

  document.getElementById("choose-o").addEventListener("click", () => {
    playerSymbol = "O";
    startGame();
  });
}

function startGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  renderBoard();
}

function renderBoard() {
  app.innerHTML = `
    <h1 class="title">Game Board</h1>

    <div class="board">
      ${board
        .map((cell, index) => `
          <div class="cell" data-index="${index}">
            ${cell}
          </div>
        `)
        .join("")}
    </div>
  `;

  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.addEventListener("click", handleMove);
  });
}

function handleMove(event) {
  const index = event.target.dataset.index;

  // impede sobrescrever jogada
  if (board[index] !== "") return;

  // registra jogada
  board[index] = currentPlayer;

  // alterna jogador
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // re-renderiza tabuleiro
  renderBoard();
}

// inicialização
renderHome();