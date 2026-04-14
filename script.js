const app = document.getElementById("app");

let selectedMode = null;
let playerSymbol = null;
let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = true;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

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
  gameActive = true;
  renderBoard();
}

function renderBoard(message = "") {
  app.innerHTML = `
    <h1 class="title">Game Board</h1>
    <p>${message}</p>

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

  if (!gameActive) return;

  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.addEventListener("click", handleMove);
  });
}

function handleMove(event) {
  const index = event.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;

  if (checkWinner()) {
    gameActive = false;
    renderBoard(`Player ${currentPlayer} wins!`);
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameActive = false;
    renderBoard("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  renderBoard(`Player ${currentPlayer}'s turn`);
}

function checkWinner() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    );
  });
}

// inicialização
renderHome();