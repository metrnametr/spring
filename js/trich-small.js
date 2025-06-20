const trichStart = (p) => {
    let nodes = [];
let connections = [];
const RADIUS    = 160;
const CENTER    = { x: 240, y: 240 };
const MIN_DIST  = 18;
const NOISE_SCALE = 0.015;
const DENSITY_THRESHOLD = 0.4;

p.setup = () => {
    p.createCanvas(480, 480);
    p.angleMode(p.RADIANS);
    p.background(0);
    p.noiseSeed(p.floor(p.random(10000)));

  nodes.push({ x: CENTER.x, y: CENTER.y, age: 0, r0: 10, amp: 1.5, speed: 0.12 });

  for (let iter = 0; iter < 1000 && nodes.length < 240; iter++) {
    const angle = p.random(p.TWO_PI);
    const radius = p.random(20, RADIUS);
    const nx = CENTER.x + p.cos(angle) * radius;
    const ny = CENTER.y + p.sin(angle) * radius;

    if (!insideCircle(nx, ny) || !farEnough(nx, ny)) continue;
    if (p.noise(nx * NOISE_SCALE, ny * NOISE_SCALE) < DENSITY_THRESHOLD) continue;

    const base = findNearestNode(nx, ny);
    const newNode = {
      x: nx,
      y: ny,
      age: p.random(p.TWO_PI),
      r0: p.random(8, 14),
      amp: p.random(0.8, 1.5),
      speed: p.random(0.06, 0.14)
    };
    nodes.push(newNode);
    if (base) connections.push({ a: base, b: newNode });
  }
}

p.draw = () => {
    p.background(0);

  // Пульсирующая линия-связь
  for (const c of connections) {
    const t = p.frameCount * 0.05 + (c.a.age + c.b.age) * 0.5;
    const glow = p.map(p.sin(t), -1, 1, 100, 255);
    p.stroke(255, 50, 30, glow);  // ярко-красный пульсирующий
    p.strokeWeight(1.2);
    p.line(c.a.x, c.a.y, c.b.x, c.b.y);
  }

  for (const n of nodes) {
    const t = p.frameCount * n.speed + n.age;
    const pulse = p.sin(t);
    const glow = p.map(pulse, -1, 1, 100, 255);

    // внешний ореол/контур
    p.noFill();
    p.stroke(255, 180, 40, glow * 0.6);
    p.strokeWeight(2 + n.amp * 0.6);
    p.ellipse(n.x, n.y, (n.r0 + n.amp * pulse) + 4);

    // основное тело
    p.noStroke();
    p.fill(255, 160, 0, glow);
    const r = n.r0 + n.amp * pulse;
    p.ellipse(n.x, n.y, r);
  }
}

function insideCircle(x, y) {
  return p.dist(x, y, CENTER.x, CENTER.y) < RADIUS;
}

function farEnough(x, y) {
  for (const n of nodes) {
    if (p.dist(x, y, n.x, n.y) < MIN_DIST) return false;
  }
  return true;
}

function findNearestNode(x, y) {
  let closest = null;
  let minD = Infinity;
  for (const n of nodes) {
    const d = p.dist(x, y, n.x, n.y);
    if (d < minD) {
      minD = d;
      closest = n;
    }
  }
  return closest;
}
}


// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(trichStart, 'trich');
});