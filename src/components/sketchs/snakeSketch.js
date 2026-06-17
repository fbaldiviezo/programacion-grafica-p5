// ponytail: self-contained p5.js instance mode sketch with native audio synth
export const snakeSketch = (p) => {
  let audioCtx = null;
  function playTone(freq, type, duration) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      let osc = audioCtx.createOscillator();
      let gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  let state = 'MENU';
  let score = 0, highScore = 0;
  
  const cols = 40, rows = 25, cellSize = 20;
  const w = cols * cellSize, h = rows * cellSize;

  let snake = [];
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let food = { x: 0, y: 0, isGold: false };
  let frameDelay = 7;
  let powerTimer = 0;
  let particles = [];

  p.setup = () => {
    p.createCanvas(w, h);
    loadHighScore();
  };

  p.draw = () => {
    p.background(10, 15, 12);
    drawGridLines();

    if (state === 'MENU') {
      drawMenu();
    } else if (state === 'PLAY') {
      updateGame();
      drawGame();
    } else if (state === 'GAMEOVER') {
      drawGameOver();
    }

    updateAndDrawParticles();
  };

  function drawGridLines() {
    p.stroke(34, 197, 94, 10);
    p.strokeWeight(1);
    for (let x = 0; x < w; x += cellSize) {
      p.line(x, 0, x, h);
    }
    for (let y = 0; y < h; y += cellSize) {
      p.line(0, y, w, y);
    }
  }

  function drawMenu() {
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(34, 197, 94);
    p.textSize(36);
    p.textStyle(p.BOLD);
    p.text("NEON SNAKE", w / 2, 130);

    p.fill(200);
    p.textSize(18);
    p.textStyle(p.NORMAL);
    p.text(`Record Actual: ${highScore} pts`, w / 2, 210);
    
    p.fill(34, 197, 94);
    p.textSize(20);
    p.text("Presiona ENTER o ESPACIO para Jugar", w / 2, 280);

    p.fill(120);
    p.textSize(14);
    p.text("Controles: Flechas o teclas WASD", w / 2, 380);
  }

  function drawGame() {
    if (food.isGold) {
      p.fill(234, 179, 8);
      p.ellipse(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, cellSize * 0.95);
    } else {
      p.fill(239, 68, 68);
      p.ellipse(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, cellSize * 0.8);
    }

    for (let i = 0; i < snake.length; i++) {
      if (i === 0) {
        p.fill(34, 197, 94);
      } else {
        p.fill(22, 163, 74, p.map(i, 0, snake.length, 255, 100));
      }
      p.rect(snake[i].x * cellSize + 1, snake[i].y * cellSize + 1, cellSize - 2, cellSize - 2, 4);
    }

    p.fill(255, 255, 255, 180);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Puntos: ${score}`, 20, 20);
    if (powerTimer > 0) {
      p.fill(234, 179, 8);
      p.text(`¡SUPER VELOCIDAD! (${Math.ceil(powerTimer / 60)}s)`, 150, 20);
    }
  }

  function drawGameOver() {
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(239, 68, 68);
    p.textSize(36);
    p.text("GAME OVER", w / 2, 160);

    p.fill(200);
    p.textSize(20);
    p.text(`Puntuación final: ${score} pts`, w / 2, 220);
    p.fill(34, 197, 94);
    p.text("Presiona ENTER para continuar", w / 2, 300);
  }

  function updateGame() {
    if (powerTimer > 0) {
      powerTimer--;
    }

    let currentDelay = powerTimer > 0 ? 3 : frameDelay;
    if (p.frameCount % currentDelay !== 0) return;

    dir = nextDir;
    let head = snake[0];
    let newHead = { x: head.x + dir.x, y: head.y + dir.y };

    if (newHead.x < 0) newHead.x = cols - 1;
    if (newHead.x >= cols) newHead.x = 0;
    if (newHead.y < 0) newHead.y = rows - 1;
    if (newHead.y >= rows) newHead.y = 0;

    for (let part of snake) {
      if (newHead.x === part.x && newHead.y === part.y) {
        endGame();
        return;
      }
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      eatFood();
    } else {
      snake.pop();
    }
  }

  function eatFood() {
    let points = food.isGold ? 5 : 1;
    score += points;

    if (food.isGold) {
      powerTimer = 300;
      playTone(600, 'sine', 0.25);
      createExplosion(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, '#eab308');
    } else {
      playTone(450, 'triangle', 0.1);
      createExplosion(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, '#22c55e');
    }

    spawnFood();
  }

  function spawnFood() {
    let valid = false;
    while (!valid) {
      food.x = p.floor(p.random(cols));
      food.y = p.floor(p.random(rows));
      valid = true;
      for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
          valid = false;
          break;
        }
      }
    }
    food.isGold = p.random() < 0.15;
  }

  function initGame() {
    snake = [
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    powerTimer = 0;
    spawnFood();
    state = 'PLAY';
  }

  function endGame() {
    state = 'GAMEOVER';
    playTone(150, 'sawtooth', 0.5);
    if (score > highScore) {
      highScore = score;
      saveHighScore();
    }
  }

  function loadHighScore() {
    try {
      let val = localStorage.getItem('arcade_snake_hs');
      if (val) highScore = parseInt(val);
    } catch (e) {}
  }

  function saveHighScore() {
    try {
      localStorage.setItem('arcade_snake_hs', highScore);
    } catch (e) {}
  }

  p.keyPressed = () => {
    if (state === 'MENU') {
      if (p.keyCode === p.ENTER || p.key === ' ') {
        initGame();
      }
    } else if (state === 'GAMEOVER') {
      if (p.keyCode === p.ENTER || p.key === ' ') {
        state = 'MENU';
      }
    } else if (state === 'PLAY') {
      if ((p.keyCode === p.UP_ARROW || p.key === 'w' || p.key === 'W') && dir.y === 0) {
        nextDir = { x: 0, y: -1 };
      } else if ((p.keyCode === p.DOWN_ARROW || p.key === 's' || p.key === 'S') && dir.y === 0) {
        nextDir = { x: 0, y: 1 };
      } else if ((p.keyCode === p.LEFT_ARROW || p.key === 'a' || p.key === 'A') && dir.x === 0) {
        nextDir = { x: -1, y: 0 };
      } else if ((p.keyCode === p.RIGHT_ARROW || p.key === 'd' || p.key === 'D') && dir.x === 0) {
        nextDir = { x: 1, y: 0 };
      }
    }
  };

  function createExplosion(x, y, color) {
    for (let i = 0; i < 12; i++) {
      particles.push({
        x: x, y: y,
        vx: p.random(-4, 4), vy: p.random(-4, 4),
        life: 255, color: color
      });
    }
  }

  function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      let part = particles[i];
      part.x += part.vx;
      part.y += part.vy;
      part.life -= 15;
      if (part.life <= 0) {
        particles.splice(i, 1);
      } else {
        p.noStroke();
        let c = p.color(part.color);
        p.fill(p.red(c), p.green(c), p.blue(c), part.life);
        p.ellipse(part.x, part.y, 6);
      }
    }
  }
};
