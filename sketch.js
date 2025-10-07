let visuals = [];

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

//draw function
function draw() {
  background(0, 0, 10, 10);

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
}

//method to translate typing word into visual display
function addVisual(data) {
  const { char, speed, isVowel, isConsonant, isNumber, isPunct, isEnter } = data;

  let hue = map(speed, 20, 800, 0, 300, true);
  let baseX = random(width);
  let baseY = random(height);
  let size = random(20, 100);
  let alpha = 255;

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
