let shapes = [];

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  background(0, 0, 10, 10); // faint trail
  for (let s of shapes) {
    fill(s.h, 80, 90, 70);
    ellipse(s.x, s.y, s.size);
    s.y -= s.speed; // float up
    s.alpha -= 1;   // fade over time
  }
  shapes = shapes.filter(s => s.alpha > 0);
}

function addShape(speed, wordLength) {
  // Map typing metrics to visuals
  let hue = map(speed, 20, 800, 0, 300, true);
  let size = map(wordLength, 1, 12, 20, 120, true);
  let ySpeed = map(speed, 20, 800, 2, 0.5, true);

  shapes.push({
    x: random(width),
    y: height,
    size: size,
    h: hue,
    speed: ySpeed,
    alpha: 255
  });
}
