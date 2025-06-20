
const stemBigStart = (p) => {
    let bubbles = [];
const GAP = 2;
const ADD_PER_FRAME = 4;
const TARGET_FILL = 0.45;           // 45 % площади круга

// --- геометрия рабочей зоны (круг) ---
const REGION_RADIUS = 430;          // 860 px диаметром
let REGION_AREA;
let CENTER;

let filledArea = 0;

p.setup = () => {
  p.createCanvas(1022, 1022);         // холст прежнего размера
  CENTER = p.createVector(p.width / 2, p.height / 2);
  REGION_AREA = p.PI * REGION_RADIUS * REGION_RADIUS;

  initScene();
}

function initScene() {
    p.background(0);
  bubbles = [];
  filledArea = 0;

  // первая пузыринка — в центре окружности
  const initialRadius = 8;
  const first = new Bubble(CENTER.x, CENTER.y, initialRadius);
  bubbles.push(first);
  first.display();
  filledArea += p.PI * initialRadius * initialRadius;
}

p.draw = () => {
  let added = 0, tries = 0;
  while (
    added < ADD_PER_FRAME &&
    tries < 200 &&
    filledArea < TARGET_FILL * REGION_AREA
  ) {
    tries++;

    const parent = p.random(bubbles);
    const ang = p.random(p.TWO_PI);
    const r = p.random(5, 10);
    const distFromParent = parent.r + r + GAP;

    const nx = parent.x + p.cos(ang) * distFromParent;
    const ny = parent.y + p.sin(ang) * distFromParent;

    // проверка: точка должна быть внутри окружности
    if (p.dist(nx, ny, CENTER.x, CENTER.y) > REGION_RADIUS - r) continue;

    let ok = true;
    for (let b of bubbles) {
      if (p.dist(nx, ny, b.x, b.y) < b.r + r + GAP) {
        ok = false;
        break;
      }
    }

    if (ok) {
      const bubble = new Bubble(nx, ny, r);
      bubbles.push(bubble);
      bubble.display();
      filledArea += p.PI * r * r;
      added++;
    }
  }

  // ☑️ достигли лимита — перезапускаем анимацию
  if (filledArea >= TARGET_FILL * REGION_AREA) initScene();
}

// ---------- класс пузыря ---------- //
class Bubble {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display() {
    // тень
    p.noStroke();
    p.fill(50, 50, 100, 60);
    p.ellipse(this.x + this.r * 0.35, this.y + this.r * 0.35, this.r * 4);

    // тело + обводка
    p.stroke(55, 30, 80, 40);
    p.strokeWeight(0.8);
    p.fill('#F2BE01');
    p.ellipse(this.x, this.y, this.r * 2);
  }
}

}
// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(stemBigStart, 'stem');
});