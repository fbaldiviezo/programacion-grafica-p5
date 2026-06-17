// ponytail: self-contained p5.js instance mode sketch with native audio synth
export const breakoutSketch = (p) => {
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
  let score = 0, lives = 3;

  const w = 800, h = 500;
  
  let paddle = { x: 350, y: 460, w: 100, baseW: 100, h: 15 };
  let balls = [];
  
  let bricks = [];
  const cols = 10, rows = 4;
  const brickW = 70, brickH = 20;
  const paddingX = 8, paddingY = 8;
  const gridOffsetY = 60, gridOffsetX = 12;

  let powerups = [];
  let powerupTimer = 0;
  let activePowerup = null;
  
  let particles = [];
  let shake = 0;

  p.setup = () => {
    p.createCanvas(w, h);
  };

  p.draw = () => {
    if (shake > 0) {
      p.translate(p.random(-shake, shake), p.random(-shake, shake));
      shake *= 0.9;
      if (shake < 0.2) shake = 0;
    }

    p.background(15, 10, 20);
    drawGridBackground();

    if (state === 'MENU') {
      drawMenu();
    } else {
      if (state === 'PLAY') {
        updateGame();
      } else if (state === 'READY') {
        updatePaddleOnly();
      }
      drawGame();
    }

    updateAndDrawParticles();
  };

  function drawGridBackground() {
    p.stroke(147, 51, 234, 15);
    p.strokeWeight(1);
    for (let x = 0; x < w; x += 40) {
      p.line(x, 0, x, h);
    }
    for (let y = 0; y < h; y += 40) {
      p.line(0, y, w, y);
    }
  }

  function drawMenu() {
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(168, 85, 247);
    p.textSize(36);
    p.textStyle(p.BOLD);
    p.text("GALACTIC BREAKOUT", w / 2, 140);

    p.fill(200);
    p.textSize(20);
    p.textStyle(p.NORMAL);
    p.text("Presiona ENTER o ESPACIO para Iniciar", w / 2, 250);

    p.fill(120);
    p.textSize(14);
    p.text("Mueve el mouse para la paleta | ESPACIO para lanzar bola", w / 2, 380);
  }

  function drawGame() {
    for (let b of bricks) {
      if (!b.active) continue;
      let c = p.color(168, 85, 247);
      if (b.row === 0) c = p.color(239, 68, 68);
      else if (b.row === 1) c = p.color(249, 115, 22);
      else if (b.row === 2) c = p.color(34, 197, 94);
      else c = p.color(6, 182, 212);

      p.fill(c);
      p.noStroke();
      p.rect(b.x, b.y, brickW, brickH, 3);
    }

    p.fill(168, 85, 247);
    p.rect(paddle.x, paddle.y, paddle.w, paddle.h, 6);

    p.fill(255);
    for (let b of balls) {
      p.ellipse(b.x, b.y, b.r * 2);
    }

    for (let pu of powerups) {
      let pc = pu.type === 'WIDE' ? p.color(34, 197, 94) : p.color(6, 182, 212);
      p.fill(pc);
      p.rect(pu.x - 10, pu.y - 8, 20, 16, 6);
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.textStyle(p.BOLD);
      p.text(pu.type === 'WIDE' ? 'W' : 'M', pu.x, pu.y);
    }
    p.textStyle(p.NORMAL);

    p.fill(255, 255, 255, 200);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`PUNTOS: ${score}`, 20, 20);

    p.textAlign(p.RIGHT, p.TOP);
    let livesStr = "";
    for (let i = 0; i < lives; i++) livesStr += "♥ ";
    p.fill(236, 72, 153);
    p.text(`VIDAS: ${livesStr}`, w - 20, 20);

    if (state === 'READY') {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(18);
      p.text("Presiona ESPACIO para lanzar la bola", w / 2, h / 2 + 50);
    } else if (state === 'GAMEOVER') {
      drawOverlay("GAME OVER", p.color(239, 68, 68));
    } else if (state === 'VICTORY') {
      drawOverlay("¡VICTORIA GALÁCTICA!", p.color(34, 197, 94));
    }
  }

  function drawOverlay(title, col) {
    p.fill(0, 0, 0, 180);
    p.rect(0, 0, w, h);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(col);
    p.textSize(36);
    p.textStyle(p.BOLD);
    p.text(title, w / 2, h / 2 - 30);
    p.fill(200);
    p.textSize(18);
    p.textStyle(p.NORMAL);
    p.text(`Puntuación final: ${score} pts`, w / 2, h / 2 + 20);
    p.text("Presiona ENTER para volver al menú principal", w / 2, h / 2 + 70);
  }

  function updatePaddleOnly() {
    if (p.mouseX > 0 && p.mouseX < w) {
      paddle.x = p.constrain(p.mouseX - paddle.w/2, 0, w - paddle.w);
    }
    if (balls.length > 0) {
      balls[0].x = paddle.x + paddle.w / 2;
      balls[0].y = paddle.y - balls[0].r - 2;
    }
  }

  function updateGame() {
    if (p.mouseX > 0 && p.mouseX < w) {
      paddle.x = p.constrain(p.mouseX - paddle.w/2, 0, w - paddle.w);
    }

    if (powerupTimer > 0) {
      powerupTimer--;
      if (powerupTimer <= 0) {
        paddle.w = paddle.baseW;
        activePowerup = null;
      }
    }

    for (let i = balls.length - 1; i >= 0; i--) {
      let b = balls[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.x - b.r <= 0) {
        b.x = b.r;
        b.vx = -b.vx;
        playTone(320, 'sine', 0.05);
      } else if (b.x + b.r >= w) {
        b.x = w - b.r;
        b.vx = -b.vx;
        playTone(320, 'sine', 0.05);
      }

      if (b.y - b.r <= 0) {
        b.y = b.r;
        b.vy = -b.vy;
        playTone(320, 'sine', 0.05);
      }

      if (b.y - b.r > h) {
        balls.splice(i, 1);
        continue;
      }

      if (b.vy > 0 && b.y + b.r >= paddle.y && b.y - b.r <= paddle.y + paddle.h) {
        if (b.x >= paddle.x && b.x <= paddle.x + paddle.w) {
          let hitFactor = (b.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
          let angle = hitFactor * p.PI / 3.5;
          b.vx = b.speed * p.sin(angle);
          b.vy = -b.speed * p.cos(angle);
          b.y = paddle.y - b.r;
          playTone(400, 'triangle', 0.08);
        }
      }

      checkBrickCollision(b);
    }

    if (balls.length === 0) {
      loseLife();
    }

    for (let i = powerups.length - 1; i >= 0; i--) {
      let pu = powerups[i];
      pu.y += 3;
      
      if (pu.y + 8 >= paddle.y && pu.y - 8 <= paddle.y + paddle.h) {
        if (pu.x >= paddle.x && pu.x <= paddle.x + paddle.w) {
          applyPowerup(pu.type);
          powerups.splice(i, 1);
          continue;
        }
      }
      
      if (pu.y > h + 15) {
        powerups.splice(i, 1);
      }
    }

    let activeBricks = bricks.filter(br => br.active);
    if (activeBricks.length === 0) {
      state = 'VICTORY';
      playTone(700, 'sine', 0.4);
    }
  }

  function checkBrickCollision(ball) {
    for (let b of bricks) {
      if (!b.active) continue;

      if (ball.x + ball.r >= b.x && ball.x - ball.r <= b.x + brickW &&
          ball.y + ball.r >= b.y && ball.y - ball.r <= b.y + brickH) {
        
        ball.vy = -ball.vy;
        b.active = false;
        score += 10;
        shake = 4;
        playTone(500, 'square', 0.1);
        createBrickExplosion(b.x + brickW/2, b.y + brickH/2);

        if (p.random() < 0.15) {
          powerups.push({
            x: b.x + brickW/2,
            y: b.y + brickH/2,
            type: p.random() > 0.5 ? 'WIDE' : 'MULTI'
          });
        }
        break;
      }
    }
  }

  function applyPowerup(type) {
    playTone(600, 'sine', 0.2);
    if (type === 'WIDE') {
      paddle.w = paddle.baseW * 1.5;
      powerupTimer = 480;
      activePowerup = 'WIDE';
    } else if (type === 'MULTI') {
      if (balls.length > 0) {
        let baseBall = balls[0];
        balls.push({
          x: baseBall.x, y: baseBall.y,
          vx: -baseBall.vx, vy: baseBall.vy,
          r: baseBall.r, speed: baseBall.speed
        });
        balls.push({
          x: baseBall.x, y: baseBall.y,
          vx: baseBall.vx * 0.5, vy: -baseBall.vy,
          r: baseBall.r, speed: baseBall.speed
        });
      }
    }
  }

  function loseLife() {
    lives--;
    powerups = [];
    paddle.w = paddle.baseW;
    activePowerup = null;
    powerupTimer = 0;

    if (lives <= 0) {
      state = 'GAMEOVER';
      playTone(180, 'sawtooth', 0.5);
    } else {
      playTone(200, 'sawtooth', 0.25);
      state = 'READY';
      balls = [{ x: w/2, y: h - 50, vx: 0, vy: 0, r: 8, speed: 6 }];
    }
  }

  function initGame() {
    score = 0;
    lives = 3;
    powerups = [];
    paddle.w = paddle.baseW;
    
    bricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: gridOffsetX + c * (brickW + paddingX),
          y: gridOffsetY + r * (brickH + paddingY),
          row: r,
          active: true
        });
      }
    }

    balls = [{ x: w/2, y: h - 50, vx: 0, vy: 0, r: 8, speed: 6 }];
    state = 'READY';
  }

  function launchBall() {
    if (state !== 'READY' || balls.length === 0) return;
    let angle = p.random(-p.PI/6, p.PI/6);
    balls[0].vx = balls[0].speed * p.sin(angle);
    balls[0].vy = -balls[0].speed * p.cos(angle);
    state = 'PLAY';
    playTone(400, 'sine', 0.1);
  }

  p.keyPressed = () => {
    if (state === 'MENU') {
      if (p.keyCode === p.ENTER || p.key === ' ') {
        initGame();
      }
    } else if (state === 'READY') {
      if (p.key === ' ' || p.keyCode === p.ENTER) {
        launchBall();
      }
    } else if (state === 'GAMEOVER' || state === 'VICTORY') {
      if (p.keyCode === p.ENTER || p.key === ' ') {
        state = 'MENU';
      }
    }
  };

  function createBrickExplosion(x, y) {
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: x, y: y,
        vx: p.random(-4, 4), vy: p.random(-4, 4),
        life: 255, color: '#a855f7'
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
        p.ellipse(part.x, part.y, 5);
      }
    }
  }
};
