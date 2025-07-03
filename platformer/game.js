const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

class Player {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 50;
    this.y = canvas.height - this.height - 60;
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

    // Jump
    if (keys['Space'] && this.grounded) {
      this.velY = -this.jumpStrength;
      this.grounded = false;
    }

    // Apply gravity
    this.velY += 0.5; // gravity
    this.x += this.velX;
    this.y += this.velY;

    // Collision with floor
    if (this.y + this.height > canvas.height - 20) {
      this.y = canvas.height - this.height - 20;
      this.velY = 0;
      this.grounded = true;
    }

    // Keep inside canvas
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
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

const player = new Player();
const platforms = [
  new Platform(0, canvas.height - 20, canvas.width, 20),
  new Platform(150, 300, 100, 10),
  new Platform(300, 250, 120, 10),
  new Platform(500, 200, 100, 10)
];

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
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  checkCollisions();
  player.draw();
  for (let p of platforms) {
    p.draw();
  }
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

loop();
