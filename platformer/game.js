const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

// Altura total del mundo (mayor que la del canvas para permitir scroll)
const worldHeight = 800;
let cameraY = 0;

class Player {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 50;
    // Comenzar cerca de la parte inferior del mundo
    this.y = worldHeight - this.height - 60;
    this.velX = 0;
    this.velY = 0;
    this.speed = 3;
    this.jumpStrength = 10;
    this.grounded = false;
  }

  update() {
    // Horizontal movement
    if (keys['ArrowLeft']) {
      this.velX = -this.speed;
    } else if (keys['ArrowRight']) {
      this.velX = this.speed;
    } else {
      this.velX = 0;
    }

    // Saltar con la flecha arriba o la barra espaciadora
    if ((keys['ArrowUp'] || keys['Space']) && this.grounded) {
      this.velY = -this.jumpStrength;
      this.grounded = false;
    }

    // Gravedad
    this.velY += 0.5;
    this.x += this.velX;
    this.y += this.velY;

    // Colisión con el suelo del mundo
    if (this.y + this.height > worldHeight - 20) {
      this.y = worldHeight - this.height - 20;
      this.velY = 0;
      this.grounded = true;
    }

    // Mantener dentro de los límites del mundo
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y < 0) {
      this.y = 0;
      this.velY = 0;
    }
  }

  draw() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = '#888';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor(x, y) {
    this.width = 40;
    this.height = 40;
    this.x = x;
    this.y = y;
    this.speed = 1.5;
  }

  update() {
    if (player.x < this.x) this.x -= this.speed;
    if (player.x > this.x) this.x += this.speed;
  }

  draw() {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Coin {
  constructor(x, y) {
    this.radius = 8;
    this.x = x;
    this.y = y;
    this.collected = false;
  }

  draw() {
    if (this.collected) return;
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const player = new Player();
const platforms = [
  new Platform(0, worldHeight - 20, canvas.width, 20),
  new Platform(150, worldHeight - 120, 100, 10),
  new Platform(300, worldHeight - 200, 120, 10),
  new Platform(500, worldHeight - 300, 100, 10),
  new Platform(200, worldHeight - 400, 100, 10)
];

const enemy = new Enemy(600, worldHeight - 60);

const coins = [
  new Coin(170, worldHeight - 130),
  new Coin(320, worldHeight - 210),
  new Coin(520, worldHeight - 310),
  new Coin(220, worldHeight - 410)
];

let coinCount = 0;

function checkCollisions() {
  player.grounded = false;
  for (let p of platforms) {
    if (player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y) {
      // Simple collision response from top
      if (player.velY > 0 && player.y + player.height - player.velY <= p.y) {
        player.y = p.y - player.height;
        player.velY = 0;
        player.grounded = true;
      }
    }
  }

  // Colisión con monedas
  for (let c of coins) {
    if (!c.collected &&
        player.x < c.x + c.radius &&
        player.x + player.width > c.x - c.radius &&
        player.y < c.y + c.radius &&
        player.y + player.height > c.y - c.radius) {
      c.collected = true;
      coinCount += 1;
    }
  }

  // Colisión con el enemigo
  if (player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y) {
    // Reiniciar al jugador si toca al enemigo
    player.x = 50;
    player.y = worldHeight - player.height - 60;
    coinCount = 0;
    for (let c of coins) c.collected = false;
  }
}

function updateCamera() {
  cameraY = Math.max(0, Math.min(worldHeight - canvas.height,
    player.y - canvas.height / 2));
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  checkCollisions();
  updateCamera();

  ctx.save();
  ctx.translate(0, -cameraY);
  player.draw();
  enemy.draw();
  for (let p of platforms) {
    p.draw();
  }
  for (let c of coins) {
    c.draw();
  }
  ctx.restore();

  // Mostrar contador de monedas
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Monedas: ${coinCount}`, 10, 20);

  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
  keys[e.code] = false;
});

loop();
