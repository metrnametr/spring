// '.green-animation'

// /*
//   Physarum – thin, sparse, various speeds
//   p5.js
// */

// let branches = [];

// function setup(p) {
//     if (!p) {
//         return; 
//     }
//     p.setup = () => {
//         p.createCanvas(140, 140);
//         p.colorMode(HSB, 360, 100, 100, 100);
//         p.background(0);                      // чёрный фон
//         p.noFill();
//         for (let i = 0; i < 8; i++) {
//             let ang = TWO_PI * i / 8;
//             let spd = random(0.5, 2);         // индивидуальная скорость
//             branches.push(new Branch(width / 2, height / 2, ang, 6, spd));
//           }
//     }

//     p.draw = () => {
//         for (let i = branches.length - 1; i >= 0; i--) {
//             let b = branches[i];
//             b.update();
//             b.show();
        
//             if (b.dead) branches.splice(i, 1);
//           }
        
//           if (branches.length === 0) setup(); // перезапуск, когда всё затухло
//     }

//   // 8 стартовых жилок из центра
  
// }

// function draw() {
//   for (let i = branches.length - 1; i >= 0; i--) {
//     let b = branches[i];
//     b.update();
//     b.show();

//     if (b.dead) branches.splice(i, 1);
//   }

//   if (branches.length === 0) setup(); // перезапуск, когда всё затухло
// }

// /* -------- класс ветви -------- */
// class Branch {
//   constructor(x, y, angle, w, spd) {
//     this.pos   = createVector(x, y);
//     this.angle = angle;
//     this.w     = w;          // толщина
//     this.spd   = spd;        // СКОРОСТЬ
//     this.dead  = false;
//   }

//   update() {
//     if (this.dead) return;

//     // лёгкий шум угла
//     this.angle += random(-0.05, 0.05);

//     // шаг с индивидуальной скоростью
//     this.pos.x += cos(this.angle) * this.spd;
//     this.pos.y += sin(this.angle) * this.spd;

//     // редкое ветвление
//     if (random() < 0.015 && this.w > 1.2) {
//       let childSpd = constrain(this.spd + random(-0.3, 0.3), 0.4, 2.2);
//       branches.push(new Branch(this.pos.x, this.pos.y,
//                                this.angle + random(-PI / 4, PI / 4),
//                                this.w * 0.7,
//                                childSpd));
//     }

//     // плавное утоньшение
//     this.w *= 0.995;
//     if (this.w < 0.5 ||
//         this.pos.x < 0 || this.pos.x > width ||
//         this.pos.y < 0 || this.pos.y > height) {
//       this.dead = true;
//     }
//   }

//   show() {
//     stroke(90, 100, 95);         // ярко-салатовый
//     strokeWeight(this.w);
//     point(this.pos.x, this.pos.y);
//   }
// }

// new window.p5(setup, 'green-animation')


const physarum = (p) => {
    let branches = [];

    p.setup = () => {
        const container = document.getElementById('green-animation');
        const canvas = p.createCanvas(800, 800);
        canvas.parent('green-animation');
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
        p.noFill();

        // 8 стартовых жилок из центра
        for (let i = 0; i < 8; i++) {
            let ang = p.TWO_PI * i / 8;
            let spd = p.random(0.5, 2);
            branches.push(new Branch(p.width / 2, p.height / 2, ang, 6, spd));
        }
    };

    p.draw = () => {
        for (let i = branches.length - 1; i >= 0; i--) {
            let b = branches[i];
            b.update();
            b.show();

            if (b.dead) branches.splice(i, 1);
        }

        if (branches.length === 0) {
            // Перезапуск с новыми параметрами
            for (let i = 0; i < 8; i++) {
                let ang = p.TWO_PI * i / 8;
                let spd = p.random(0.5, 2);
                branches.push(new Branch(
                    p.width/2 + p.random(-100, 100),
                    p.height/2 + p.random(-100, 100),
                    ang, 
                    6, 
                    spd
                ));
            }
        }
    };

    p.windowResized = () => {
        const container = document.getElementById('green-animation');
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        p.background(0);
        branches = [];
    };

    /* -------- класс ветви -------- */
    class Branch {
        constructor(x, y, angle, w, spd) {
            this.pos = p.createVector(x, y);
            this.angle = angle;
            this.w = w;
            this.spd = spd;
            this.dead = false;
        }

        update() {
            if (this.dead) return;

            // Лёгкий шум угла
            this.angle += p.random(-0.05, 0.05);

            // Шаг с индивидуальной скоростью
            this.pos.x += p.cos(this.angle) * this.spd;
            this.pos.y += p.sin(this.angle) * this.spd;

            // Редкое ветвление
            if (p.random() < 0.015 && this.w > 1.2) {
                let childSpd = p.constrain(
                    this.spd + p.random(-0.3, 0.3), 0.4, 2.2
                );
                branches.push(new Branch(
                    this.pos.x,
                    this.pos.y,
                    this.angle + p.random(-p.PI/4, p.PI/4),
                    this.w * 0.7,
                    childSpd
                ));
            }

            // Плавное утоньшение
            this.w *= 0.995;
            if (this.w < 0.5 || 
                this.pos.x < 0 || this.pos.x > p.width || 
                this.pos.y < 0 || this.pos.y > p.height) {
                this.dead = true;
            }
        }

        show() {
            p.stroke(90, 100, 95); // Ярко-салатовый
            p.strokeWeight(this.w);
            p.point(this.pos.x, this.pos.y);
        }
    }
};

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(physarum, 'green-animation');
});