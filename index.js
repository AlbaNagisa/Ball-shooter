canvas.addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };
  if (projectiles.length < 12) {
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
    );
  }
});

button.addEventListener("click", () => {
  init();
  animate();
  spawnEnnemies();
  UI.style.display = "none";
  c.clearRect(0, 0, canvas.width, canvas.height);
});
