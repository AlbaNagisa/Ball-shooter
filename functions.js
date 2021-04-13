const canvas = document.querySelector("canvas");
const button = document.getElementById("button");
const UI = document.getElementById("UI");
const newScore = document.getElementById("newScore");
const highScoreEl = document.getElementById("highScore");
const highScoreEl2 = document.getElementById("highscoreEl");
const c = canvas.getContext("2d");
canvas.height = innerHeight;
canvas.width = innerWidth;
const scoreEl = document.getElementById("score");

let player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
let ennemies = [];
let projectiles = [];
let particules = [];

async function init() {
  if (highScoreEl.innerHTML < score) {
    highScoreEl.innerHTML = score;
  }

  player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
  ennemies = [];
  projectiles = [];
  particules = [];
  score = 0;
  scoreEl.innerHTML = score;
}

function spawnEnnemies() {
  let time = 1000;

  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2,
    };
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    ennemies.push(new Enemy(x, y, radius, color, velocity));
  }, time);
}
let animationId;
let score = 0;
let highScore = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particules.forEach((particule, inde) => {
    if (particule.alpha <= 0) {
      particules.splice(inde, 1);
    } else {
      particule.update();
    }
  });
  projectiles.forEach((projectile, i) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(i, 1);
      }, 0);
    }
  });
  ennemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      UI.style.display = "flex";
      newScore.innerHTML = score;
    }
    projectiles.forEach((projectile, ind) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1) {
        if (enemy.radius > 15) {
          score += 150;
        } else if (enemy.radius < 15 && enemy.radius > 10) {
          score += 100;
        } else {
          score += 50;
        }
        for (let i = 0; i < enemy.radius * 2; i++) {
          particules.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          projectiles.splice(ind, 1);
        } else {
          console.log(enemy.radius);

          scoreEl.innerHTML = score;

          ennemies.splice(index, 1);
          projectiles.splice(ind, 1);
        }
      }
    });
  });
}
