/*  Gentle silver-blue blinking droplets — 480 × 480
    Central cluster fits inside a 340 × 340 circle (radius 170)
    Subtle translucent blue overlay added
*/
const echiStart = (p) => {

const COUNT = 60;                 // fewer drops
const drops = [];
const CENTER = { x: 240, y: 240 };
const RADIUS_LIMIT = 170;         // 340 × 340 safe zone

p.setup = () => {
  p.createCanvas(480, 480);
  p.colorMode(p.HSB, 360, 100, 100, 100);
  p.background(0);
  p.noStroke();

  // scatter drops inside the radius
  for (let i = 0; i < COUNT; i++) {
    let a = p.random(p.TWO_PI);
    let d = p.random(RADIUS_LIMIT);
    let x = CENTER.x + p.cos(a) * d;
    let y = CENTER.y + p.sin(a) * d;

    drops.push({
      x, y,
      r: p.random(10, 20),   // radius
      phase: -1            // -1 = dormant
    });
  }
}

p.draw = () => {
  const dt = p.deltaTime / 1000;
  p.background(0);

  for (let d of drops) {
    // start blinking
    if (d.phase < 0 && p.random() < 0.012) d.phase = 0;

    // advance animation
    if (d.phase >= 0) {
      d.phase += dt / 1.4;      // full cycle ≈ 1.4 s
      if (d.phase >= 1) d.phase = -1;
    }

    const glow = d.phase >= 0 ? p.sin(p.PI * d.phase) : 0;  // 0 → 1 → 0

    /* — halo: silvery — */
    let auraB = 60 + glow * 25;                        // brightness
    p.fill(0, 0, auraB, 18 + glow * 40);                 // low alpha
    p.ellipse(d.x, d.y, d.r * 2.6);

    /* — translucent blue layer — */
    p.fill(200, 40, 80, 10 + glow * 30);                 // subtle blue tint
    p.ellipse(d.x, d.y, d.r * 2.4);

    /* — core: near-white — */
    let coreB = 85 + glow * 12;
    p.fill(0, 0, coreB, 50 + glow * 35);
    p.ellipse(d.x, d.y, d.r * 1.2);
  }
}

}

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(echiStart, 'echi');
});