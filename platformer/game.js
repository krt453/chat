const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

class Player {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 50;

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

      this.velY = -this.jumpStrength;
      this.grounded = false;
    }


      this.velY = 0;
      this.grounded = true
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

  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;

});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;

});

loop();
