const ceraStart = (p) => {
    // --- бесконечный цикл: каждые 12 сек структура перезапускается ------------------------------
let arms = [];
let startMillis;

const STRUCTURE_RADIUS = 190; // половина от 380
const CENTER_X = 240;
const CENTER_Y = 240;
const CYCLE_MS = 12000;      // длина одного цикла «рост»
const START_ARMS = 6;

p.setup = () => {
    p.createCanvas(480, 480);
    p.background(0);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    restart();
}

function restart() {
  // удаляем все старые «рукава» и создаём новую структуру
  arms = [];
  for (let i = 0; i < START_ARMS; i++) {
    arms.push(new Arm(CENTER_X, CENTER_Y, p.random(p.TWO_PI)));
  }
  startMillis = p.millis();
}

p.draw = () => {
  // по истечении цикла очищаем холст и начинаем заново
  if (p.millis() - startMillis > CYCLE_MS) {
    p.background(0);
    restart();
  }

  p.noStroke();
  for (let i = arms.length - 1; i >= 0; i--) {
    const arm = arms[i];
    arm.update();
    arm.display();

    if (arm.shouldBranch()) arms.push(arm.branch());
    if (arm.finished)       arms.splice(i, 1);
  }
}

class Arm {
  constructor(x, y, angle) {
    this.pos = p.createVector(x, y);
    this.angle = angle;
    this.speed = p.random(0.4, 1.0);
    this.radius = 8;
    this.age = 0;
    this.lifespan = p.int(p.random(90, 140));
    this.finished = false;
  }

  update() {
    this.pos.x += p.cos(this.angle) * this.speed;
    this.pos.y += p.sin(this.angle) * this.speed;
    this.radius += 0.24;
    this.age++;
    if (this.age > this.lifespan || !this.insideStructure()) this.finished = true;
  }

  display() {
    const b = p.map(this.age, 0, this.lifespan, 100, 20);
    p.fill(0, 0, b, 90);
    p.ellipse(this.pos.x, this.pos.y, this.radius);

    for (let i = 0; i < 4; i++) {
      const off = p5.Vector.random2D().mult(p.random(this.radius * 0.3));
      p.fill(0, 0, b, 50);
      p.ellipse(this.pos.x + off.x, this.pos.y + off.y, this.radius * 0.5);
    }
  }

  shouldBranch() {
    return p.random() < 0.02 && this.age > 8;
  }

  branch() {
    const newAngle = this.angle + p.random(-p.PI / 3, p.PI / 3);
    return new Arm(this.pos.x, this.pos.y, newAngle);
  }

  insideStructure() {
    return p.dist(this.pos.x, this.pos.y, CENTER_X, CENTER_Y) < STRUCTURE_RADIUS;
  }
}


}

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(ceraStart, 'cera');
});