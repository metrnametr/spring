
const echiBigStart = (p) => {
    /*  Gentle random blinking droplets with subtle blue shifts
    p5.js — 1022×1022, fully black background
    Each droplet fades from a warm ochre tone toward a light grey‑blue (#A2C6DA)
    with a **hint** of darker blue (#334762) at the peak of its glow, giving
    a refined, cool shimmer without overpowering the palette.
*/

const COUNT = 220;          // сколько капель
const drops = [];
let colLight, colDark;      // целевые голубые оттенки

p.setup = () => {
  p.createCanvas(1022, 1022);
  p.colorMode(p.HSB, 360, 100, 100, 100);
  p.background(0);            // полностью чёрный фон
  p.noStroke();

  colLight = p.color('#A2C6DA');   // светло‑голубой / серо‑голубой
  colDark  = p.color('#334762');   // тёмно‑голубой штрих

  // рассыпаем капельки
  for (let i = 0; i < COUNT; i++) {
    drops.push({
      x: p.random(p.width),
      y: p.random(p.height),
      r: p.random(6, 16),
      base: p.color(                       // тёплый охристо‑коричневый старт
        p.random([20, 25, 30, 35]),
        p.random(25, 45),
        p.random(35, 65)
      ),
      phase: -1                          // -1 → «спит»
    });
  }
}

p.draw = () => {
  const dt = p.deltaTime / 1000;           // секунды с последнего кадра
  p.background(0);

  for (let d of drops) {

    // шанс начать мигание
    if (d.phase < 0 && p.random() < 0.01) d.phase = 0;

    // обновление фазы
    if (d.phase >= 0) {
      d.phase += dt / 1.2;               // полный цикл ≈ 1.2 с
      if (d.phase >= 1) d.phase = -1;
    }

    // glow — кривая 0→1→0
    const glow = d.phase >= 0 ? p.sin(p.PI * d.phase) : 0;

    /* —— рисуем —— */

    // сначала тянем базу к светлому голубому
    let midCol = p.lerpColor(d.base, colLight, glow * 0.75);

    // затем добавляем лёгкую примесь тёмно‑голубого на пике (до 20 %)
    const auraCol = p.lerpColor(midCol, colDark, glow * 0.2);
    p.fill(p.hue(auraCol), p.saturation(auraCol), p.brightness(auraCol), 25 + glow * 45);
    p.ellipse(d.x, d.y, d.r * 1.8);

    // ядро: то же, но сильнее высветляем
    const coreBlend = p.lerpColor(auraCol, p.color(0, 0, 100), glow * 0.9);
    p.fill(coreBlend);
    p.ellipse(d.x, d.y, d.r);
  }
}

}
// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(echiBigStart, 'echi');
});