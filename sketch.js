let visuals = [];
let ripples = [];
let sparks = [];
let energy = 0;

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

//draw function
function draw() {
  background(0, 0, 10, 10);

  //draw ripple & sparks animations
  drawRipples();
  drawSparks();

  for (let v of visuals) {
    if (v.type === 'circle') {
      fill(v.h, 80, 90, v.alpha);
      ellipse(v.x, v.y, v.size);
    } 
    else if (v.type === 'string') {
      stroke(v.h, 80, 100, v.alpha);
      line(v.x, v.y, v.x + v.len * sin(frameCount * 0.05), v.y - v.len);
    } 
    else if (v.type === 'square') {
      fill(v.h, 60, 90, v.alpha);
      rect(v.x, v.y, v.size, v.size);
    } 
    else if (v.type === 'burst') {
      fill(v.h, 100, 100, v.alpha);
      ellipse(v.x, v.y, v.size + sin(frameCount * 0.5) * 10);
    } 
    else if (v.type === 'wave') {
      noFill();
      stroke(v.h, 80, 100, v.alpha);
      ellipse(v.x, v.y, v.size + sin(frameCount * 0.1) * 20);
    }

    //move by direction
    v.x += v.dx;
    v.y += v.dy;

    //wrap edges (keep visuals circulating)
    if (v.x < 0) v.x = width;
    if (v.x > width) v.x = 0;
    if (v.y < 0) v.y = height;
    if (v.y > height) v.y = 0;

    //fade out slowly
    v.alpha -= 0.4;
  }

  visuals = visuals.filter(v => v.alpha > 0);
  drawEnergyBar();
}

//method to add circular ripple effect 
function addRipple(x, y, hue) {
  ripples.push({
    x: x,
    y: y,
    r: 0,
    alpha: 255,
    h: hue
  });
}

//method to draw dripples
function drawRipples() {
  for (let r of ripples) {
    noFill();
    stroke(r.h, 80, 100, r.alpha);
    ellipse(r.x, r.y, r.r);
    r.r += 2.5; // expansion rate
    r.alpha -= 5; // fade
  }
  ripples = ripples.filter(r => r.alpha > 0);
}

//method to display energy bar = matchin with typing intensity
function drawEnergyBar() {
  noStroke();
  fill(200, 80, 100, 80);
  rect(0, height - 10, map(energy, 0, 100, 0, width), 10);
  energy = max(0, energy - 0.3); // decay slowly
}

//method to add sparks
function addSparks(x, y, hue, count = 5) {
  for (let i = 0; i < count; i++) {
    sparks.push({
      x: x,
      y: y,
      dx: random(-2, 2),
      dy: random(-2, 2),
      alpha: 255,
      size: random(3, 6),
      h: hue
    });
  }
}

//method to display spark when typing is fast enough
function drawSparks() {
  for (let s of sparks) {
    noStroke();
    fill(s.h, 90, 100, s.alpha);
    ellipse(s.x, s.y, s.size);
    s.x += s.dx;
    s.y += s.dy;
    s.alpha -= 6; // fade
  }
  sparks = sparks.filter(s => s.alpha > 0);
}


//method to translate typing word into visual display
function addVisual(data) {
  const { char, speed, isVowel, isConsonant, isNumber, isPunct, isEnter } = data;

  let hue = map(speed, 20, 800, 0, 300, true);
  let baseX = random(width);
  let baseY = random(height);
  let size = random(20, 100);
  let alpha = 255;

  //add ripple (centered or random)
  addRipple(random(width), random(height), hue);

  //charge up energy bar
  energy = min(100, energy + 5);

  //trigger combo sparks for fast typing
  if (speed < 120) {
    addSparks(random(width), random(height), hue, random(4, 8));
  }

  //pick a random direction vector
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: 1, dy: 0 },  // right
    { dx: -1, dy: 0 }  // left
  ];
  const dir = random(directions);
  const moveSpeed = random(0.5, 1.5);

  //random chance to mix types
  const chance = random(1); // 0.0 to 1.0
  let typeOverride = null;

  if (chance < 0.2) typeOverride = 'string';
  else if (chance < 0.4) typeOverride = 'square';
  else if (chance < 0.6) typeOverride = 'circle';
  else if (chance < 0.8) typeOverride = 'burst';
  //20% reserved for default rule

  //apply type rules with optional override
  let type = 'circle';
  if (typeOverride) type = typeOverride;
  else if (isVowel) type = 'string';
  else if (isConsonant) type = 'circle';
  else if (isNumber) type = 'square';
  else if (isPunct) type = 'burst';
  else if (isEnter) type = 'wave';

  //create object based on type
  if (type === 'string') {
    visuals.push({
      type,
      x: baseX,
      y: baseY,
      len: random(40, 120),
      h: hue,
      alpha,
      dx: dir.dx * moveSpeed,
      dy: dir.dy * moveSpeed
    });
  } 
  else if (type === 'circle') {
    visuals.push({
      type,
      x: baseX,
      y: baseY,
      size,
      h: hue,
      alpha,
      dx: dir.dx * moveSpeed,
      dy: dir.dy * moveSpeed
    });
  } 
  else if (type === 'square') {
    visuals.push({
      type,
      x: baseX,
      y: baseY,
      size: size / 2,
      h: hue + 50,
      alpha,
      dx: dir.dx * moveSpeed,
      dy: dir.dy * moveSpeed
    });
  } 
  else if (type === 'burst') {
    visuals.push({
      type,
      x: random(width),
      y: random(height),
      size: size / 2,
      h: hue + 100,
      alpha,
      dx: 0,
      dy: 0
    });
  } 
  else if (type === 'wave') {
    visuals.push({
      type,
      x: width / 2,
      y: height / 2,
      size: random(100, 300),
      h: hue,
      alpha,
      dx: 0,
      dy: 0
    });
  }
}
