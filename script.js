const app = document.getElementById("app");

let selectedMode = null;

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
    console.log("Mode:", selectedMode, "| Player chose: X");
  });

  document.getElementById("choose-o").addEventListener("click", () => {
    console.log("Mode:", selectedMode, "| Player chose: O");
  });
}

// inicialização
renderHome();