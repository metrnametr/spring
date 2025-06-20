

const greenBigStart = (p) => {
/*  Physarum-style branching with thicker tips
    p5.js — 1022×1022, black background, starts from centre
*/

let branches = [];

p.setup = () => {
  p.createCanvas(1022, 1022);
  p.colorMode(p.HSB, 360, 100, 100, 100);
  p.background(0);          // полностью чёрный фон
  p.noFill();
  p.strokeCap(p.ROUND);

  // 8 стартовых жилок из центра
  for (let i = 0; i < 8; i++) {
    let ang = p.TWO_PI * i / 8;
    let spd = p.random(0.5, 2);          // индивидуальная скорость
    branches.push(new Branch(p.width / 2, p.height / 2, ang, 6, spd));
  }
}

p.draw = () => {
  for (let i = branches.length - 1; i >= 0; i--) {
    let b = branches[i];
    b.update();
    b.show();

    if (b.dead) branches.splice(i, 1);
  }

  if (branches.length === 0) p.setup();  // перезапуск при затухании
}

/* ---------- класс ветви ---------- */
class Branch {
  constructor(x, y, angle, w, spd) {
    this.pos   = p.createVector(x, y);
    this.prev  = this.pos.copy();      // предыдущая позиция для линии
    this.angle = angle;
    this.w     = w;                    // текущая толщина
    this.spd   = spd;                  // скорость шага
    this.dead  = false;
  }

  update() {
    if (this.dead) return;

    // шум угла
    this.angle += p.random(-0.05, 0.05);

    // сохранить прошлую позицию
    this.prev.set(this.pos);

    // шаг вперёд
    this.pos.x += p.cos(this.angle) * this.spd;
    this.pos.y += p.sin(this.angle) * this.spd;

    // редкое ветвление
    if (p.random() < 0.015 && this.w > 1.2) {
      let childSpd = p.constrain(this.spd + p.random(-0.3, 0.3), 0.4, 2.2);
      branches.push(new Branch(this.pos.x, this.pos.y,
                               this.angle + p.random(-p.PI / 4, p.PI / 4),
                               this.w * 0.7,
                               childSpd));
    }

    // плавное утоньшение
    this.w *= 0.996;
    if (this.w < 0.5 ||
        this.pos.x < 0 || this.pos.x > p.width ||
        this.pos.y < 0 || this.pos.y > p.height) {
      this.dead = true;
    }
  }

  show() {
    // основная линия
    p.stroke('#BDCB63');               // мягкий жёлто-зелёный
    p.strokeWeight(p.max(this.w, 0.5));
    p.line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);

    // толщина на самом кончике — эллипс чуть крупнее текущей толщины
    p.noStroke();
    p.fill('#BDCB63');
    p.ellipse(this.pos.x, this.pos.y, this.w * 1.6);
  }
}
}


// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(greenBigStart, 'green-big');
});