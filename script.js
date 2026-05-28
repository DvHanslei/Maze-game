const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

const levelText = document.getElementById("leval");
const timeText = document.getElementById("Time");

const TILE_SIZE = 30;
let rows = 20;
let cols = 20;
let maze = [];
let player = { x: 1, y: 1 };
let exit = { x: cols - 2, y: rows - 2 };
let level = 1;
let timer = 0;

// Imagens
const imgHeroi = new Image();
imgHeroi.src = "Hansleizito.png";
const imgBau = new Image();
imgBau.src = "bauzito.png";
const imgParede = new Image();
imgParede.src = "paredezito.png";

setInterval(() => {
  timer++;
  if (timeText) timeText.textContent = timer;
}, 1000);

function createMaze() {
  maze = [];
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      row.push(1);
    }
    maze.push(row);
  }

  function carve(x, y) {
    const directions = shuffle([
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0]
    ]);
    maze[y][x] = 0;
    for (let dir of directions) {
      let nx = x + dir[0];
      let ny = y + dir[1];
      if (
        ny > 0 &&
        ny < rows - 1 &&
        nx > 0 &&
        nx < cols - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[y + dir[1] / 2][x + dir[0] / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  maze[1][1] = 0;
  
  // GARANTE O BAÚ LIVRE: Força o caminho e os blocos ao redor a ficarem abertos (0)
  maze[rows - 2][cols - 2] = 0;
  maze[rows - 2][cols - 3] = 0;
  maze[rows - 3][cols - 2] = 0;

  player.x = 1;
  player.y = 1;
  exit.x = cols - 2;
  exit.y = rows - 2;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        if (imgParede.complete && imgParede.naturalWidth > 0) {
          ctx.drawImage(imgParede, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        } else {
          ctx.fillStyle = "#333";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      } else {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Desenha o baú
  if (imgBau.complete && imgBau.naturalWidth > 0) {
    ctx.drawImage(imgBau, exit.x * TILE_SIZE, exit.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = "gold";
    ctx.fillRect(exit.x * TILE_SIZE, exit.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  // Desenha o herói
  if (imgHeroi.complete && imgHeroi.naturalWidth > 0) {
    ctx.drawImage(imgHeroi, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      player.x * TILE_SIZE + TILE_SIZE / 2,
      player.y * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE / 3, 0, Math.PI * 2
    );
    ctx.fill();
  }
}

function movePlayer(dx, dy) {
  let nx = player.x + dx;
  let ny = player.y + dy;
  if (maze[ny] && maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    checkWin();
    drawMaze();
  }
}

function checkWin() {
  if (player.x === exit.x && player.y === exit.y) {
    level++;
    if (levelText) levelText.textContent = level;
    
    // O código que aumentava as variáveis 'rows' e 'cols' foi removido daqui!
    
    createMaze();
    drawMaze();
    alert("Fase concluída! 🎉");
  }
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":    movePlayer(0, -1); break;
    case "ArrowDown":  movePlayer(0, 1);  break;
    case "ArrowLeft":  movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0);  break;
  }
});

// Botões mobile
function addBtn(id, dx, dy) {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => movePlayer(dx, dy));
}
addBtn("up",    0, -1);
addBtn("down",  0,  1);
addBtn("left", -1,  0);
addBtn("rigth", 1,  0);
addBtn("right", 1,  0);

// Iniciar jogo
createMaze();
drawMaze();
