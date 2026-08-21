const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const powerupInfo = document.getElementById('powerupInfo');
const difficultySelect = document.getElementById('difficultySelect');

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

const DIFFICULTIES = {
  easy: { speed: 100, name: 'Easy' },
  normal: { speed: 80, name: 'Normal' },
  hard: { speed: 50, name: 'Hard' }
};

let snake = [
  { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let powerup = null;
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameRunning = false;
let gameOver = false;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let difficulty = 'normal';
let gameSpeed = DIFFICULTIES.normal.speed;
let invincible = false;
let invincibleTime = 0;
let lastUpdateTime = 0;

highScoreDisplay.textContent = highScore;

// オーディオコンテキスト作成
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.type = type;
  osc.frequency.value = frequency;

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  osc.start(now);
  osc.stop(now + duration);
}

function playEatSound() {
  playSound(400, 0.1);
  playSound(600, 0.1);
}

function playPowerupSound() {
  playSound(800, 0.15, 'square');
  playSound(1200, 0.15, 'square');
}

function playGameOverSound() {
  playSound(300, 0.2);
  playSound(200, 0.3);
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      if (invincible) {
        drawTile(segment.x, segment.y, '#ffff00');
      } else {
        drawTile(segment.x, segment.y, '#00ff00');
      }
    } else {
      drawTile(segment.x, segment.y, '#00cc00');
    }
  });

  // Draw food
  drawTile(food.x, food.y, '#ff0000');

  // Draw powerup
  if (powerup) {
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    const centerX = (powerup.x + 0.5) * GRID_SIZE;
    const centerY = (powerup.y + 0.5) * GRID_SIZE;
    ctx.arc(centerX, centerY, GRID_SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', centerX, centerY);
  }
}

function update() {
  if (!gameRunning) return;

  // Update invincible timer
  if (invincible) {
    invincibleTime -= 1;
    if (invincibleTime <= 0) {
      invincible = false;
      canvas.classList.remove('invincible');
      powerupInfo.textContent = '';
    } else {
      powerupInfo.textContent = `⭐ 無敵状態: ${Math.ceil(invincibleTime / (gameSpeed / 16))}秒`;
    }
  }

  direction = nextDirection;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    if (!invincible) {
      endGame();
      return;
    }
  }

  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    if (!invincible) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = score;
    playEatSound();
    generateFood();
    if (Math.random() < 0.3) {
      generatePowerup();
    }
  } else {
    snake.pop();
  }

  // Check powerup collision
  if (powerup && head.x === powerup.x && head.y === powerup.y) {
    score += 50;
    scoreDisplay.textContent = score;
    playPowerupSound();
    invincible = true;
    invincibleTime = gameSpeed * 5;
    canvas.classList.add('invincible');
    powerup = null;
  }
}

function generateFood() {
  let newFood;
  let collision;

  do {
    collision = false;
    newFood = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };

    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      collision = true;
    }
    if (powerup && powerup.x === newFood.x && powerup.y === newFood.y) {
      collision = true;
    }
  } while (collision);

  food = newFood;
}

function generatePowerup() {
  let newPowerup;
  let collision;

  do {
    collision = false;
    newPowerup = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };

    if (snake.some(segment => segment.x === newPowerup.x && segment.y === newPowerup.y)) {
      collision = true;
    }
    if (newPowerup.x === food.x && newPowerup.y === food.y) {
      collision = true;
    }
  } while (collision);

  powerup = newPowerup;
}

function gameLoop(currentTime) {
  if (lastUpdateTime === 0) {
    lastUpdateTime = currentTime;
  }

  const deltaTime = currentTime - lastUpdateTime;

  if (deltaTime >= gameSpeed) {
    update();
    lastUpdateTime = currentTime;
  }

  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gameOver = false;
  statusDisplay.textContent = 'Game Running...';
  startBtn.textContent = 'Pause';
}

function pauseGame() {
  gameRunning = false;
  statusDisplay.textContent = 'Paused - Press SPACE to resume';
  startBtn.textContent = 'Resume';
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  invincible = false;
  canvas.classList.remove('invincible');
  powerupInfo.textContent = '';
  playGameOverSound();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreDisplay.textContent = highScore;
    statusDisplay.textContent = `Game Over! New High Score: ${score}`;
  } else {
    statusDisplay.textContent = `Game Over! Score: ${score}`;
  }

  startBtn.textContent = 'Start Game';
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreDisplay.textContent = score;
  gameRunning = false;
  gameOver = false;
  invincible = false;
  powerup = null;
  canvas.classList.remove('invincible');
  powerupInfo.textContent = '';
  lastUpdateTime = 0;
  generateFood();
  statusDisplay.textContent = `Press SPACE to start (${DIFFICULTIES[difficulty].name})`;
  startBtn.textContent = 'Start Game';
  draw();
}

document.addEventListener('keydown', (e) => {
  switch (e.key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      if (direction.y === 0) nextDirection = { x: 0, y: -1 };
      e.preventDefault();
      break;
    case 'arrowdown':
    case 's':
      if (direction.y === 0) nextDirection = { x: 0, y: 1 };
      e.preventDefault();
      break;
    case 'arrowleft':
    case 'a':
      if (direction.x === 0) nextDirection = { x: -1, y: 0 };
      e.preventDefault();
      break;
    case 'arrowright':
    case 'd':
      if (direction.x === 0) nextDirection = { x: 1, y: 0 };
      e.preventDefault();
      break;
    case ' ':
      if (gameOver) {
        resetGame();
      } else if (gameRunning) {
        pauseGame();
      } else {
        startGame();
      }
      e.preventDefault();
      break;
  }
});

startBtn.addEventListener('click', () => {
  if (gameRunning) {
    pauseGame();
  } else if (gameOver) {
    resetGame();
    startGame();
  } else {
    startGame();
  }
});

resetBtn.addEventListener('click', resetGame);

// Difficulty selection
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedDifficulty = btn.dataset.difficulty;
    difficulty = selectedDifficulty;
    gameSpeed = DIFFICULTIES[difficulty].speed;

    difficultyButtons.forEach(b => b.removeAttribute('data-selected'));
    btn.setAttribute('data-selected', 'true');

    if (gameRunning || gameOver) {
      resetGame();
    } else {
      statusDisplay.textContent = `Press SPACE to start (${DIFFICULTIES[difficulty].name})`;
    }
  });

  if (btn.dataset.selected === 'true') {
    btn.setAttribute('data-selected', 'true');
  }
});

resetGame();
requestAnimationFrame(gameLoop);
