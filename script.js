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
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
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
  document.getElementById("easy").onclick = () => { difficulty="easy"; renderSymbolSelection(); };
  document.getElementById("medium").onclick = () => { difficulty="medium"; renderSymbolSelection(); };
  document.getElementById("hard").onclick = () => { difficulty="hard"; renderSymbolSelection(); };
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
    selectedMode === "computer" ? renderDifficultySelection() : renderHome();
  };

  document.getElementById("choose-x").onclick = () => {
    playerSymbol="X"; computerSymbol="O"; startGame();
  };

  document.getElementById("choose-o").onclick = () => {
    playerSymbol="O"; computerSymbol="X"; startGame();
  };
}

function startGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  winningPattern = [];

  renderBoard();
}

function renderBoard(message="") {
  app.innerHTML = `
    <button class="back-btn" id="back">Back</button>
    <h1 class="title">Game Board</h1>
    <p>${message}</p>

    <div class="board" id="board">
      ${board.map((cell, i)=>{
        const cls = cell==="X"?"x":cell==="O"?"o":"";
        return `<div class="cell ${cls}" data-index="${i}">${cell}</div>`;
      }).join("")}
    </div>

    <button class="reset-btn" id="reset">Reset</button>
  `;

  document.getElementById("back").onclick = renderHome;
  document.getElementById("reset").onclick = startGame;

  if (!gameActive) return;

  document.querySelectorAll(".cell").forEach(c => c.onclick = handleMove);
}

function handleMove(e) {
  const i = e.target.dataset.index;
  if (board[i] || !gameActive) return;
  if (selectedMode==="computer" && currentPlayer===computerSymbol) return;
  makeMove(i);
}

function makeMove(i) {
  board[i] = currentPlayer;

  const win = checkWinner();
  if (win) {
    gameActive=false;
    winningPattern=win;
    renderBoard(`Player ${currentPlayer} wins!`);

    // 🔥 desenhar linha após render
    setTimeout(drawWinLine, 50);

    return;
  }

  if (board.every(c=>c)) {
    gameActive=false;
    renderBoard("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer==="X"?"O":"X";
  renderBoard();

  if (selectedMode==="computer" && currentPlayer===computerSymbol) {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  const move =
    findBestMove(computerSymbol) ??
    findBestMove(playerSymbol) ??
    randomMove();

  makeMove(move);
}

function randomMove() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function findBestMove(symbol) {
  for (let [a,b,c] of winPatterns) {
    const vals=[board[a],board[b],board[c]];
    if (vals.filter(v=>v===symbol).length===2 && vals.includes("")) {
      if (!board[a]) return a;
      if (!board[b]) return b;
      if (!board[c]) return c;
    }
  }
  return null;
}

function checkWinner() {
  for (let p of winPatterns) {
    const [a,b,c]=p;
    if (board[a] && board[a]===board[b] && board[a]===board[c]) return p;
  }
  return null;
}

// 🎯 NOVA IMPLEMENTAÇÃO PERFEITA
function drawWinLine() {
  const boardEl = document.getElementById("board");
  const cells = document.querySelectorAll(".cell");

  const first = cells[winningPattern[0]].getBoundingClientRect();
  const last = cells[winningPattern[2]].getBoundingClientRect();
  const boardRect = boardEl.getBoundingClientRect();

  const x1 = first.left + first.width / 2 - boardRect.left;
  const y1 = first.top + first.height / 2 - boardRect.top;

  const x2 = last.left + last.width / 2 - boardRect.left;
  const y2 = last.top + last.height / 2 - boardRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  const line = document.createElement("div");
  line.className = "win-line " + (currentPlayer === "X" ? "x" : "o");

  line.style.width = `${length}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.transformOrigin = "left center";

  boardEl.appendChild(line);
}

// navegação
document.addEventListener("click", e=>{
  if (e.target.id==="vs-computer") {
    selectedMode="computer";
    renderDifficultySelection();
  }
  if (e.target.id==="vs-player") {
    selectedMode="player";
    renderSymbolSelection();
  }
});

renderHome();