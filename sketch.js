let visuals = [];

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  background(0, 0, 10, 10);

  for (let v of visuals) {
    if (v.type === 'circle') {
      fill(v.h, 80, 90, v.alpha);
      ellipse(v.x, v.y, v.size);
      v.y -= v.speed;
    }

    else if (v.type === 'string') {
      stroke(v.h, 80, 100, v.alpha);
      line(v.x, v.y, v.x + v.len * sin(frameCount * 0.05), v.y - v.len);
      v.y -= v.speed / 2;
      v.alpha -= 1;
    }

    else if (v.type === 'square') {
      fill(v.h, 60, 90, v.alpha);
      rect(v.x, v.y, v.size, v.size);
      v.y -= v.speed;
    }

    else if (v.type === 'burst') {
      fill(v.h, 100, 100, v.alpha);
      ellipse(v.x, v.y, v.size + sin(frameCount * 0.5) * 10);
      v.alpha -= 2;
    }

    else if (v.type === 'wave') {
      noFill();
      stroke(v.h, 80, 100, v.alpha);
      ellipse(v.x, v.y, v.size + sin(frameCount * 0.1) * 20);
      v.alpha -= 2;
    }

    v.alpha -= 0.5;
  }

  visuals = visuals.filter(v => v.alpha > 0);
}

function addVisual(data) {
  const { char, speed, isVowel, isConsonant, isNumber, isPunct, isEnter } = data;

  let hue = map(speed, 20, 800, 0, 300, true);
  let baseX = random(width);
  let baseY = height;
  let size = random(20, 100);
  let alpha = 255;

  if (isVowel) {
    visuals.push({ type: 'string', x: baseX, y: baseY, len: random(40, 120), h: hue, alpha, speed: 1 });
  } 
  else if (isConsonant) {
    visuals.push({ type: 'circle', x: baseX, y: baseY, size, h: hue, alpha, speed: 1.5 });
  } 
  else if (isNumber) {
    visuals.push({ type: 'square', x: baseX, y: baseY, size: size / 2, h: hue + 50, alpha, speed: 1.2 });
  } 
  else if (isPunct) {
    visuals.push({ type: 'burst', x: baseX, y: baseY, size: size / 2, h: hue + 100, alpha, speed: 0 });
  } 
  else if (isEnter) {
    visuals.push({ type: 'wave', x: width / 2, y: height / 2, size: random(100, 300), h: hue, alpha, speed: 0 });
  }
}

