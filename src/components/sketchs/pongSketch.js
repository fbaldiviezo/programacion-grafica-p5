// ponytail: self-contained p5.js instance mode sketch with native audio synth
export const pongSketch = (p) => {
  let audioCtx = null;
  function playTone(freq, type, duration) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      let osc = audioCtx.createOscillator();
      let gain = audioCtx.createGain();
      osc.type = type || 'square';
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
  let gameMode = '1P';
  let score1 = 0, score2 = 0;
  const winScore = 7;
  let winner = '';

  const w = 800, h = 500;
  let p1 = { y: 200, h: 90, w: 15, x: 20 };
  let p2 = { y: 200, h: 90, w: 15, x: 765 };
  let ball = { x: 400, y: 250, vx: 0, vy: 0, r: 8, baseSpeed: 5, speed: 5 };
  let particles = [];
  let shake = 0;
  let keys = {};

  p.setup = () => {
    p.createCanvas(w, h);
  };

  p.draw = () => {
    if (shake > 0) {
      p.translate(p.random(-shake, shake), p.random(-shake, shake));
      shake *= 0.9;
      if (shake < 0.2) shake = 0;
    }

    p.background(15, 15, 23);
    drawMidLine();

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

  function drawMidLine() {
    p.stroke(255, 255, 255, 30);
    p.strokeWeight(2);
    for (let i = 0; i < h; i += 30) {
      p.line(w / 2, i, w / 2, i + 15);
    }
  }

  function drawMenu() {
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(59, 130, 246);
    p.textSize(36);
    p.textStyle(p.BOLD);
    p.text("ARCADE PONG", w / 2, 120);

    p.fill(200);
    p.textSize(18);
    p.textStyle(p.NORMAL);
    p.text(`Modo: ${gameMode === '1P' ? '1 Jugador vs CPU' : '2 Jugadores Local'} (Presiona M para cambiar)`, w / 2, 220);
    p.fill(34, 197, 94);
    p.textSize(20);
    p.text("Presiona ENTER o ESPACIO para Jugar", w / 2, 280);

    p.fill(120);
    p.textSize(14);
    p.text("Controles J1: W / S  |  Controles J2: Flechas Arriba/Abajo", w / 2, 380);
  }

  function drawGame() {
    p.fill(255, 255, 255, 70);
    p.textSize(64);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(score1, w / 2 - 50, 30);
    p.textAlign(p.LEFT, p.TOP);
    p.text(score2, w / 2 + 50, 30);

    p.fill(34, 197, 94);
    p.rect(p1.x, p1.y, p1.w, p1.h, 4);
    p.fill(239, 68, 68);
    p.rect(p2.x, p2.y, p2.w, p2.h, 4);

    p.fill(255);
    p.ellipse(ball.x, ball.y, ball.r * 2);
  }

  function drawGameOver() {
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(239, 68, 68);
    p.textSize(36);
    p.text(winner, w / 2, 160);

    p.fill(200);
    p.textSize(20);
    p.text(`Marcador Final: ${score1} - ${score2}`, w / 2, 220);
    p.fill(59, 130, 246);
    p.text("Presiona ENTER para volver al menú", w / 2, 300);
  }

  function updateGame() {
    if (keys['w'] || keys[87]) p1.y -= 7; // W
    if (keys['s'] || keys[83]) p1.y += 7; // S
    p1.y = p.constrain(p1.y, 0, h - p1.h);

    if (gameMode === '2P') {
      if (keys[p.UP_ARROW] || keys[38]) p2.y -= 7;
      if (keys[p.DOWN_ARROW] || keys[40]) p2.y += 7;
    } else {
      let targetY = ball.y - p2.h / 2;
      let diff = targetY - p2.y;
      if (p.abs(diff) > 5) {
        p2.y += Math.sign(diff) * 4.5;
      }
    }
    p2.y = p.constrain(p2.y, 0, h - p2.h);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.r <= 0) {
      ball.y = ball.r;
      ball.vy = -ball.vy;
      playTone(300, 'triangle', 0.08);
    } else if (ball.y + ball.r >= h) {
      ball.y = h - ball.r;
      ball.vy = -ball.vy;
      playTone(300, 'triangle', 0.08);
    }

    if (ball.vx < 0 && ball.x - ball.r <= p1.x + p1.w && ball.x + ball.r >= p1.x) {
      if (ball.y >= p1.y && ball.y <= p1.y + p1.h) {
        let hitFactor = (ball.y - (p1.y + p1.h / 2)) / (p1.h / 2);
        ball.speed = p.min(ball.speed * 1.05, 15);
        ball.vx = ball.speed * p.cos(hitFactor * p.PI / 4);
        ball.vy = ball.speed * p.sin(hitFactor * p.PI / 4);
        ball.x = p1.x + p1.w + ball.r;
        playTone(440, 'square', 0.1);
        createHitParticles(ball.x, ball.y, '#22c55e');
      }
    }

    if (ball.vx > 0 && ball.x + ball.r >= p2.x && ball.x - ball.r <= p2.x + p2.w) {
      if (ball.y >= p2.y && ball.y <= p2.y + p2.h) {
        let hitFactor = (ball.y - (p2.y + p2.h / 2)) / (p2.h / 2);
        ball.speed = p.min(ball.speed * 1.05, 15);
        ball.vx = -ball.speed * p.cos(hitFactor * p.PI / 4);
        ball.vy = ball.speed * p.sin(hitFactor * p.PI / 4);
        ball.x = p2.x - ball.r;
        playTone(440, 'square', 0.1);
        createHitParticles(ball.x, ball.y, '#ef4444');
      }
    }

    if (ball.x < 0) {
      score2++;
      playTone(180, 'sawtooth', 0.35);
      shake = 10;
      checkWin();
      if (state === 'PLAY') resetBall(1);
    } else if (ball.x > w) {
      score1++;
      playTone(600, 'sine', 0.2);
      shake = 10;
      checkWin();
      if (state === 'PLAY') resetBall(-1);
    }
  }

  function resetBall(dir) {
    ball.x = w / 2;
    ball.y = h / 2;
    ball.speed = ball.baseSpeed;
    let angle = p.random(-p.PI / 6, p.PI / 6);
    ball.vx = dir * ball.speed * p.cos(angle);
    ball.vy = ball.speed * p.sin(angle);
  }

  function checkWin() {
    if (score1 >= winScore) {
      state = 'GAMEOVER';
      winner = "¡GANADOR: JUGADOR 1!";
      playTone(880, 'triangle', 0.4);
    } else if (score2 >= winScore) {
      state = 'GAMEOVER';
      winner = gameMode === '2P' ? "¡GANADOR: JUGADOR 2!" : "¡GANADOR: CPU!";
      playTone(220, 'triangle', 0.5);
    }
  }

  function startGame() {
    score1 = 0;
    score2 = 0;
    state = 'PLAY';
    resetBall(p.random() > 0.5 ? 1 : -1);
  }

  p.keyPressed = () => {
    keys[p.key.toLowerCase()] = true;
    keys[p.keyCode] = true;

    if (state === 'MENU') {
      if (p.key === 'm' || p.key === 'M') {
        gameMode = gameMode === '1P' ? '2P' : '1P';
        playTone(350, 'sine', 0.05);
      }
      if (p.keyCode === p.ENTER || p.key === ' ') {
        startGame();
      }
    } else if (state === 'GAMEOVER') {
      if (p.keyCode === p.ENTER || p.key === ' ') {
        state = 'MENU';
      }
    }
  };

  p.keyReleased = () => {
    keys[p.key.toLowerCase()] = false;
    keys[p.keyCode] = false;
  };

  function createHitParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: x, y: y,
        vx: p.random(-3, 3), vy: p.random(-3, 3),
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
        p.ellipse(part.x, part.y, 5);
      }
    }
  }
};
