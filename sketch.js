let shapes = [];
let lastTime = 0;

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0, 0, 10, 10); // dark background with fading trail
  for (let s of shapes) {
    fill(s.h, 80, 90, 70);
    noStroke();
    ellipse(s.x, s.y, s.size);
    s.y -= 1; // float upward
  }
}

// Hook for editor.js to call later
function addShape(speed, wordLength) {
  let hue = map(speed, 50, 500, 0, 240, true);
  let size = map(wordLength, 1, 12, 20, 120, true);
  shapes.push({ x: random(width), y: height, size: size, h: hue });
}
