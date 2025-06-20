



// class Branch {
//   constructor(x1, y1, x2, y2, depth) {
//     this.a = createVector(x1, y1);
//     this.b = createVector(x2, y2);
//     this.baseW = map(depth, 0, DEPTH, 1, 2.4); // чуть тоньше
//     this.phase = random(TWO_PI);
//     this.children = [];

//     if (depth > 0) {
//       const n = floor(random(2, 4));
//       for (let i = 0; i < n; i++) {
//         const ang = atan2(y2 - y1, x2 - x1) + random(-PI / 4, PI / 4);
//         const len = dist(x1, y1, x2, y2) * random(0.45, 0.6); // чуть короче ветки
//         const nx  = x2 + cos(ang) * len;
//         const ny  = y2 + sin(ang) * len;
//         this.children.push(new Branch(x2, y2, nx, ny, depth - 1));
//       }
//     }
//   }

//   display() {
//     const t = frameCount * 0.08 + this.phase;
//     const pulse = 1 + 0.35 * sin(t); // усиленная пульсация

//     // свечение
//     push();
//     stroke(120, 255, 120, 70);
//     strokeWeight(this.baseW * 5 * pulse); // сильнее ореол
//     strokeCap(ROUND);
//     line(this.a.x, this.a.y, this.b.x, this.b.y);
//     pop();

//     // основная линия
//     stroke(120, 255, 120);
//     strokeWeight(this.baseW * pulse);
//     line(this.a.x, this.a.y, this.b.x, this.b.y);

//     for (const c of this.children) c.display();
//   }
// }



const physarum = (p) => {
    let branches = [];
    const ARMS  = 12;
    const DEPTH = 4;
    p.setup = () => {
        p.createCanvas(480, 480);
        p.angleMode(p.RADIANS);
        p.background(0);
      
        for (let i = 0; i < ARMS; i++) {
          const ang = p.TWO_PI * i / ARMS;
          const len = p.random(75, 95);          // уменьшено для круга R ≈ 200
          const x   = p.width  / 2 + p.cos(ang) * len;
          const y   = p.height / 2 + p.sin(ang) * len;
          branches.push(new Branch(p.width / 2, p.height / 2, x, y, DEPTH));
        }
      }
      
      p.draw = () => {
        p.background(0);
        for (const b of branches) b.display();
      }

    class Branch {
        constructor(x1, y1, x2, y2, depth) {
          this.a = p.createVector(x1, y1);
          this.b = p.createVector(x2, y2);
          this.baseW = p.map(depth, 0, DEPTH, 1, 2.4); // чуть тоньше
          this.phase = p.random(p.TWO_PI);
          this.children = [];
      
          if (depth > 0) {
            const n = p.floor(p.random(2, 4));
            for (let i = 0; i < n; i++) {
              const ang = p.atan2(y2 - y1, x2 - x1) + p.random(-p.PI / 4, p.PI / 4);
              const len = p.dist(x1, y1, x2, y2) * p.random(0.45, 0.6); // чуть короче ветки
              const nx  = x2 + p.cos(ang) * len;
              const ny  = y2 + p.sin(ang) * len;
              this.children.push(new Branch(x2, y2, nx, ny, depth - 1));
            }
          }
        }
      
        display() {
          const t = p.frameCount * 0.08 + this.phase;
          const pulse = 1 + 0.35 * p.sin(t); // усиленная пульсация
      
          // свечение
          p.push();
          p.stroke(120, 255, 120, 70);
          p.strokeWeight(this.baseW * 5 * pulse); // сильнее ореол
          p.strokeCap(p.ROUND);
          p.line(this.a.x, this.a.y, this.b.x, this.b.y);
          p.pop();
      
          // основная линия
          p.stroke(120, 255, 120);
          p.strokeWeight(this.baseW * pulse);
          p.line(this.a.x, this.a.y, this.b.x, this.b.y);
      
          for (const c of this.children) c.display();
        }
      }
};

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(physarum, 'green-small-animation');
});