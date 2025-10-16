const BOARD_SIZE = 10;
const BOARD_WIDTH = 500;
const CELL_SIZE = BOARD_WIDTH / BOARD_SIZE;
const SNAKES = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78
};
const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};
const PLAYER_COLORS = ['#f44336', '#1976d2', '#ffd600', '#43a047'];

let numPlayers = 2;
let gameStarted = false;
let currentPlayer = 0;
let positions = [];
let isGameOver = false;

const boardCanvas = document.getElementById('board');
const ctx = boardCanvas.getContext('2d');
const statusDiv = document.getElementById('status');
const diceResultDiv = document.getElementById('dice-result');
const playersPositionsDiv = document.getElementById('players-positions');
const rollDiceBtn = document.getElementById('roll-dice');
const gameAreaDiv = document.getElementById('game-area');
const playersSelect = document.getElementById('players');
const gameSettings = document.querySelector('.game-settings');
const startGameBtn = document.getElementById('start-game');

function resetGameState() {
  gameStarted = false;
  isGameOver = false;
  currentPlayer = 0;
  positions = Array(Number(numPlayers)).fill(0);
  diceResultDiv.textContent = '';
  statusDiv.textContent = '';
  playersPositionsDiv.textContent = '';
}

function startGame() {
  numPlayers = parseInt(playersSelect.value);
  resetGameState();
  gameAreaDiv.classList.remove('hidden');
  drawBoard();
  drawPlayers();
  updatePlayersPositions();
  statusDiv.textContent = `Player 1's turn`;
  gameStarted = true;
  rollDiceBtn.disabled = false;
}

function drawBoard() {
  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_WIDTH);
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      let idx = rowColToPosition(r, c);
      ctx.fillStyle = ((r + c) % 2 === 0) ? '#c8e6c9' : '#f0f4c3';
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = '#9e9e9e';
      ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(idx, c * CELL_SIZE + 4, r * CELL_SIZE + 2);
    }
  }
  // Draw ladders
  for (const [from, to] of Object.entries(LADDERS)) {
    drawConnector(Number(from), to, '#0288d1', false);
  }
  // Draw snakes
  for (const [from, to] of Object.entries(SNAKES)) {
    drawConnector(Number(from), to, '#d32f2f', true);
  }
}

function drawConnector(from, to, color, isSnake) {
  const fromCoord = positionToCoord(from);
  const toCoord = positionToCoord(to);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(fromCoord.x, fromCoord.y);
  ctx.lineTo(toCoord.x, toCoord.y);
  ctx.stroke();

  // Draw arrow (head) at the destination
  ctx.save();
  ctx.beginPath();
  let ang = Math.atan2(toCoord.y - fromCoord.y, toCoord.x - fromCoord.x);
  ctx.translate(toCoord.x, toCoord.y);
  ctx.rotate(ang);
  if (isSnake) {
    ctx.fillStyle = color;
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-10,  8);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-5, 0, 5, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    ctx.fillStyle = color;
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -7);
    ctx.lineTo(-12,  7);
    ctx.fill();
  }
  ctx.restore();
}

function rowColToPosition(row, col) {
  let base = BOARD_SIZE * (BOARD_SIZE - row - 1);
  if ((BOARD_SIZE - row) % 2 === 0) {
    // Even row: right-to-left
    return base + (BOARD_SIZE - col);
  } else {
    // Odd row: left-to-right
    return base + col + 1;
  }
}

function positionToRowCol(pos) {
  const zeroBased = pos - 1;
  const row = BOARD_SIZE - 1 - Math.floor(zeroBased / BOARD_SIZE);
  const rem = zeroBased % BOARD_SIZE;
  let col = rem;
  if ((BOARD_SIZE - row) % 2 === 0) {
    // even row: reversal
    col = BOARD_SIZE - 1 - rem;
  }
  return { row, col };
}

function positionToCoord(pos) {
  const {row, col} = positionToRowCol(pos);
  const x = col * CELL_SIZE + CELL_SIZE / 2;
  const y = row * CELL_SIZE + CELL_SIZE / 2;
  return {x, y};
}

function drawPlayers() {
  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];
    if (pos === 0) continue;
    const {row, col} = positionToRowCol(pos);
    const baseX = col * CELL_SIZE + CELL_SIZE / 2;
    const baseY = row * CELL_SIZE + CELL_SIZE / 2;
    // Offset tokens
    let angle = (2 * Math.PI * i) / positions.length;
    let radius = 15;
    let px = baseX + radius * Math.cos(angle);
    let py = baseY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, 2 * Math.PI);
    ctx.fillStyle = PLAYER_COLORS[i];
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.font = '13px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText((i + 1).toString(), px, py);
  }
}

function updatePlayersPositions() {
  playersPositionsDiv.innerHTML = '';
  for (let i = 0; i < positions.length; i++) {
    const div = document.createElement('div');
    div.classList.add('player-status');
    const dot = document.createElement('span');
    dot.className = 'player-dot';
    dot.style.background = PLAYER_COLORS[i];
    div.appendChild(dot);
    div.appendChild(document.createTextNode(`Player ${i+1}: Square ${positions[i]}`));
    if (currentPlayer === i && !isGameOver) {
      div.style.fontWeight = '700';
      div.style.color = PLAYER_COLORS[i];
    }
    playersPositionsDiv.appendChild(div);
  }
}

function rollDice() {
  if (!gameStarted || isGameOver) return;
  rollDiceBtn.disabled = true;
  diceResultDiv.textContent = 'Rolling...';
  setTimeout(() => {
    let dice = Math.floor(Math.random() * 6) + 1;
    diceResultDiv.textContent = `Rolled: ${dice}`;
    movePlayer(dice);
  }, 600);
}

function movePlayer(dice) {
  let pos = positions[currentPlayer];
  let next = pos + dice;
  if (next > 100) next = pos; // Can't overshoot
  let msg = '';
  // Check ladder
  if (LADDERS[next]) {
    msg = `Ladder! Player ${currentPlayer+1} climbs up.`;
    next = LADDERS[next];
  } else if (SNAKES[next]) {
    msg = `Snake! Player ${currentPlayer+1} slides down.`;
    next = SNAKES[next];
  }
  positions[currentPlayer] = next;
  drawBoard();
  drawPlayers();
  updatePlayersPositions();

  if (next === 100) {
    isGameOver = true;
    statusDiv.textContent = `🎉 Player ${currentPlayer+1} wins!`;
    rollDiceBtn.disabled = true;
    diceResultDiv.textContent = '';
    return;
  }
  statusDiv.textContent = msg ? `${msg} Player ${currentPlayer+1} is on square ${next}.` : `Player ${currentPlayer+1} is on square ${next}.`;
  // If dice != 6, pass turn
  if (dice !== 6) {
    currentPlayer = (currentPlayer + 1) % positions.length;
  }
  if (!isGameOver) {
    setTimeout(() => {
      statusDiv.textContent = `Player ${currentPlayer+1}'s turn`;
      updatePlayersPositions();
      rollDiceBtn.disabled = false;
    }, 700);
  }
}

rollDiceBtn.addEventListener('click', rollDice);
startGameBtn.addEventListener('click', startGame);
window.onload = () => {
  gameAreaDiv.classList.add('hidden');
};
