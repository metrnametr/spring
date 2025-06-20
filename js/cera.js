
const ceraBigStart = (p) => {
/*  Sparse silver structure • 1022×1022
    Growth window 12 s, but branching probability lowered → rarer pattern.
*/

let arms = [];
const C = { x: 511, y: 511 };
const PAD = 2;
let t0;

p.setup = () => {
  p.createCanvas(1022, 1022);
  p.colorMode(p.HSB, 360, 100, 100, 100);
  p.background(0);
  t0 = p.millis();
  for (let i = 0; i < 4; i++) arms.push(new Arm(C.x, C.y, p.random(p.TWO_PI))); // меньше стартовых ветвей
}

p.draw = () => {
  const grow = p.millis() - t0 < 15_000;
  p.noStroke();

  for (let i = arms.length - 1; i >= 0; i--) {
    const a = arms[i];
    a.upd();
    a.show();
    if (grow && a.bReady()) arms.push(a.spawn());
    if (a.dead) arms.splice(i, 1);
  }

  if (!grow && arms.length === 0) p.noLoop();
}

class Arm {
  constructor(x, y, ang) {
    this.pos = p.createVector(x, y);
    this.ang = ang;
    this.spd = p.random(0.5, 1.1);  // медленнее
    this.rad = 5;
    this.age = 0;
    this.life = p.int(p.random(80, 120));
    this.dead = false;
  }
  upd() {
    this.pos.x += p.cos(this.ang) * this.spd;
    this.pos.y += p.sin(this.ang) * this.spd;
    this.rad += 0.20000;           // чуть медленнее раздувается
    this.age++;
    if (
      this.age > this.life ||
      this.pos.x < PAD || this.pos.x > p.width - PAD ||
      this.pos.y < PAD || this.pos.y > p.height - PAD
    ) this.dead = true;
  }
  show() {
    const g = p.map(this.age, 0, this.life, 100, 25);
    p.fill(0, 0, g, 80);
    p.ellipse(this.pos.x, this.pos.y, this.rad);
  }
  bReady() {
    return p.random() < 0.045 && this.age > 6; // реже ветвится
  }
  spawn() {
    return new Arm(this.pos.x, this.pos.y, this.ang + p.random(-p.PI * 0.5, p.PI * 0.5));
  }
}

}
// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(ceraBigStart, 'cera');
});