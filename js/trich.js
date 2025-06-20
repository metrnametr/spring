const trichBigStart = (p) => {
    let nodes = [];
let connections = [];
let minDist = 15;     // минимальное расстояние между узлами

p.setup = () => {
    p.createCanvas(1022, 1022);  // изменен размер канваса
    p.background(0);  // фон черный
    p.frameRate(60);
  nodes.push({ x: p.width / 2, y: p.height / 2, age: 0, active: true });  // узел начинается с центра
}

p.draw = () => {
    p.background(0, 20);

  /* ----- линии (бордово-красные) ----- */
  p.stroke('#B32100');
  p.strokeWeight(1);
  for (let conn of connections) {
    p.line(conn.a.x, conn.a.y, conn.b.x, conn.b.y);
  }

  /* ----- узлы (оранжевые) ----- */
  p.noStroke();
  for (let node of nodes) {
    let glow = p.map(p.sin(p.frameCount * 0.2 + node.age), -1, 1, 100, 255);
    p.fill(255, 150, 0, glow);
    p.ellipse(node.x, node.y, 6 + p.sin(node.age * 0.2) * 2);
    node.age++;
  }

  /* ----- рост сети (ускорен) ----- */
  let newNodes = [];
  for (let node of nodes) {
    if (node.active && p.random() < 0.08) {
      let angle = p.random(p.TWO_PI);
      let r = p.random(20, 60);
      let newX = node.x + p.cos(angle) * r;
      let newY = node.y + p.sin(angle) * r;

      if (newX > 0 && newX < p.width && newY > 0 && newY < p.height && isFarEnough(newX, newY)) {
        let newNode = { x: newX, y: newY, age: 0, active: true };
        newNodes.push(newNode);
        connections.push({ a: node, b: newNode });
        if (p.random() < 0.3) node.active = false;
      }
    }
  }
  nodes = nodes.concat(newNodes);
}

function isFarEnough(x, y) {
  for (let node of nodes) {
    if (p.dist(x, y, node.x, node.y) < minDist) return false;
  }
  return true;
}

}

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
    new p5(trichBigStart, 'trich');
});