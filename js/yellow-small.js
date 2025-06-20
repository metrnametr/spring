const start = (p) => {
    
let nodes = [];
const C = { x: 240, y: 240 }, R = 160;
const MAX = 100, MIN_R = 2, MAX_R = 12, GAP = 8;

p.setup = () => {
  p.createCanvas(480, 480);
  p.colorMode(p.HSB, 360, 100, 100, 100);
  p.noStroke();
  p.background(0);

  let tries = 0;
  while (nodes.length < MAX && tries < 6000) {
    tries++;
    let a = p.random(p.TWO_PI);
    let d = p.random(R - MAX_R - GAP);
    let x = C.x + p.cos(a) * d;
    let y = C.y + p.sin(a) * d;
    let r = p.random(MIN_R, MAX_R);
    if (p.dist(x, y, C.x, C.y) > R - r - GAP) continue;
    if (!clear(x, y, r)) continue;

    nodes.push({ x, y, r, p: p.random(p.TWO_PI), s: p.random(0.03, 0.07), g: p.random(80, 150) });
  }
}

p.draw = () => {
  p.background(0);
  for (let n of nodes) {
    let t = p.frameCount * n.s + n.p;
    let k = 1 + 0.15 * p.sin(t);
    let rr = n.r * k;

    // пульсирующая тень: blur и альфа меняются от синуса
    let pulse = p.map(p.sin(t), -1, 1, 0.4, 1); // 0.4‑1.0
    p.push();
    p.drawingContext.shadowBlur = 20 * pulse; // blur 8‑20 px
    p.drawingContext.shadowColor = `rgba(255,200,50,${0.5 * pulse})`;
    p.fill(50, 100, 100, n.g * pulse);
    p.ellipse(n.x, n.y, rr * 2.8);
    p.pop();

    p.fill(50, 100, 100);
    p.ellipse(n.x, n.y, rr * 2);
  }
}

function clear(x, y, r) {
  for (let n of nodes) if (p.dist(x, y, n.x, n.y) < n.r + r + GAP) return false;
  return true;
}

};

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(start, 'yellow-small-animation');
});