const app = document.getElementById("app");

let selectedMode = null;
let difficulty = null;
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

function resetState() {
  selectedMode = null;
  difficulty = null;
  playerSymbol = null;
  computerSymbol = null;
  currentPlayer = "X";
  board = Array(9).fill("");
  gameActive = true;
  winningPattern = [];
}

function renderHome() {
  resetState();

  app.innerHTML = `
    <h1 class="title">Tic-Tac-Toe</h1>

    <div class="menu">
      <button id="vs-computer">Vs Computer</button>
      <button id="vs-player">2 Players</button>
    </div>
  `;
}

function renderDifficultySelection() {
  app.innerHTML = `
    <button class="back-btn" id="back">Back</button>
    <h1 class="title">Select Difficulty</h1>

    <div class="menu">
      <button id="easy">Easy</button>
      <button id="medium">Medium</button>
      <button id="hard">Hard</button>
    </div>
  `;

  document.getElementById("back").onclick = renderHome;

  document.getElementById("easy").onclick = () => {
    difficulty = "easy";
    renderSymbolSelection();
  };

  document.getElementById("medium").onclick = () => {
    difficulty = "medium";
    renderSymbolSelection();
  };

  document.getElementById("hard").onclick = () => {
    difficulty = "hard";
    renderSymbolSelection();
  };
}

function renderSymbolSelection() {
  app.innerHTML = `
    <button class="back-btn" id="back">Back</button>
    <h1 class="title">Choose your symbol</h1>

    <div class="choice">
      <button id="choose-x">X</button>
      <button id="choose-o">O</button>
    </div>
  `;

  document.getElementById("back").onclick = () => {
    if (selectedMode === "computer") {
      renderDifficultySelection();
    } else {
      renderHome();
    }
  };

  document.getElementById("choose-x").onclick = () => {
    playerSymbol = "X";
    computerSymbol = "O";
    startGame();
  };

  document.getElementById("choose-o").onclick = () => {
    playerSymbol = "O";
    computerSymbol = "X";
    startGame();
  };
}

function startGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  winningPattern = [];

  renderBoard();
}

function renderBoard(message = "") {
  const winLine = getWinLine();

  app.innerHTML = `
    <button class="back-btn" id="back">Back</button>
    <h1 class="title">Game Board</h1>
    <p>${message}</p>

    <div class="board">
      ${board
        .map((cell, index) => {
          let symbolClass = cell === "X" ? "x" : cell === "O" ? "o" : "";
          return `
            <div class="cell ${symbolClass}" data-index="${index}">
              ${cell}
            </div>
          `;
        })
        .join("")}

      ${winLine}
    </div>

    <button class="reset-btn" id="reset">Reset</button>
  `;

  document.getElementById("back").onclick = renderHome;
  document.getElementById("reset").onclick = startGame;

  if (!gameActive) return;

  document.querySelectorAll(".cell").forEach(cell => {
    cell.onclick = handleMove;
  });
}

function handleMove(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  if (selectedMode === "computer" && currentPlayer === computerSymbol) return;

  makeMove(index);
}

function makeMove(index) {
  board[index] = currentPlayer;

  const winner = checkWinner();

  if (winner) {
    gameActive = false;
    winningPattern = winner;
    renderBoard(`Player ${currentPlayer} wins!`);
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameActive = false;
    renderBoard("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  renderBoard();

  if (selectedMode === "computer" && currentPlayer === computerSymbol) {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  let move =
    findBestMove(computerSymbol) ??
    findBestMove(playerSymbol) ??
    randomMove();

  makeMove(move);
}

function randomMove() {
  const empty = board.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function findBestMove(symbol) {
  for (let [a, b, c] of winPatterns) {
    const vals = [board[a], board[b], board[c]];
    if (vals.filter(v => v === symbol).length === 2 && vals.includes("")) {
      if (board[a] === "") return a;
      if (board[b] === "") return b;
      if (board[c] === "") return c;
    }
  }
  return null;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return pattern;
    }
  }
  return null;
}

// linha visual
function getWinLine() {
  if (winningPattern.length === 0) return "";

  const [a, b, c] = winningPattern;

  const positions = [
    [0, 1, 2, "horizontal", 0],
    [3, 4, 5, "horizontal", 1],
    [6, 7, 8, "horizontal", 2],
    [0, 3, 6, "vertical", 0],
    [1, 4, 7, "vertical", 1],
    [2, 5, 8, "vertical", 2],
    [0, 4, 8, "diag1"],
    [2, 4, 6, "diag2"]
  ];

  const match = positions.find(p => p[0] === a && p[1] === b && p[2] === c);
  if (!match) return "";

  const colorClass = currentPlayer === "X" ? "x" : "o";

  if (match[3] === "horizontal") {
    return `<div class="win-line ${colorClass}" style="top:${match[4] * 33.3 + 16.6}%; left:0; width:100%;"></div>`;
  }

  if (match[3] === "vertical") {
    return `<div class="win-line ${colorClass}" style="left:${match[4] * 33.3 + 16.6}%; top:0; width:100%; transform: rotate(90deg);"></div>`;
  }

  if (match[3] === "diag1") {
    return `<div class="win-line ${colorClass}" style="top:50%; left:0; width:140%; transform: rotate(45deg);"></div>`;
  }

  if (match[3] === "diag2") {
    return `<div class="win-line ${colorClass}" style="top:50%; left:0; width:140%; transform: rotate(-45deg);"></div>`;
  }

  return "";
}

// navegação
document.addEventListener("click", e => {
  if (e.target.id === "vs-computer") {
    selectedMode = "computer";
    renderDifficultySelection();
  }

  if (e.target.id === "vs-player") {
    selectedMode = "player";
    renderSymbolSelection();
  }
});

renderHome();