const app = document.getElementById("app");

let selectedMode = null;
let playerSymbol = null;
let computerSymbol = null;
let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = true;
let winningPattern = [];

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
    computerSymbol = "O";
    startGame();
  });

  document.getElementById("choose-o").addEventListener("click", () => {
    playerSymbol = "O";
    computerSymbol = "X";
    startGame();
  });
}

function startGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  winningPattern = [];
  renderBoard(`Player ${currentPlayer}'s turn`);

  // IA começa se for o turno dela
  if (selectedMode === "computer" && currentPlayer === computerSymbol) {
    setTimeout(computerMove, 500);
  }
}

function renderBoard(message = "") {
  app.innerHTML = `
    <h1 class="title">Game Board</h1>
    <p>${message}</p>

    <div class="board">
      ${board
        .map((cell, index) => {
          const isWinningCell = winningPattern.includes(index);
          return `
            <div class="cell ${isWinningCell ? "win" : ""}" data-index="${index}">
              ${cell}
            </div>
          `;
        })
        .join("")}
    </div>

    <button class="reset-btn" id="reset">Reset</button>
  `;

  document.getElementById("reset").addEventListener("click", startGame);

  if (!gameActive) return;

  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.addEventListener("click", handleMove);
  });
}

function handleMove(event) {
  const index = event.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  // impede clique durante turno da IA
  if (selectedMode === "computer" && currentPlayer === computerSymbol) return;

  makeMove(index);
}

function makeMove(index) {
  board[index] = currentPlayer;

  const winnerPattern = checkWinner();

  if (winnerPattern) {
    gameActive = false;
    winningPattern = winnerPattern;
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

  if (selectedMode === "computer" && currentPlayer === computerSymbol) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  if (!gameActive) return;

  const emptyCells = board
    .map((cell, index) => (cell === "" ? index : null))
    .filter(index => index !== null);

  const randomIndex =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  makeMove(randomIndex);
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return pattern;
    }
  }

  return null;
}

// inicialização
renderHome();