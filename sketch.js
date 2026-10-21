/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let isDispersed = false;
let flyTimer = 0;
let col = 22; 
let row = 15; 
let flowerX = 200;
let flowerY = 200;
let sparkTimer = 0;  
let sparkX = 0;     
let sparkY = 0;
let cloudX1 = 100;
let cloudX2 = 500;
let petalX = 100;
let petalY = 0;

function setup(){
  createCanvas(800, 500);
  colorMode(HSB, 360, 100, 100, 100);
}

// ----------------------------------------------------
function draw() {
  // render background environment layer
  drawScene();
  
  // render front interactive layer
  drawInteractiveElements();
}

// ----------------------------------------------------
function drawScene() {
  drawDaytimeSky();
  drawSunshine();
  drawMountains();
  drawClouds();
  drawFallingPetals();
  drawGridElements();
}

// ----------------------------------------------------
// render front interactive layer：flower / butterfly / sparker
function drawInteractiveElements() {
  // flower& butterfly movement
  let floatY = sin(frameCount * 0.05) * 15; 
  if (!isDispersed) {
    flowerX = lerp(flowerX, mouseX, 0.05);
    flowerY = lerp(flowerY, mouseY, 0.05);
    drawFlower(flowerX, flowerY + floatY, sin(frameCount * 0.04) * 0.3);
    flyTimer = 0;  
  } else {
    flyTimer += 1;
    for (let i = 0; i < 8; i++) {
      drawButterfly(i, flyTimer);
    }
  }

  // sparking effect
  if (sparkTimer > 0) {
    for (let i = 0; i < 12; i++) {
      let angle = (TWO_PI / 12) * i + noise(i); 
      let r = (30 - sparkTimer) * 2.5 + random(-10, 10); 
      let px = sparkX + cos(angle) * r;
      let py = sparkY + sin(angle) * r + random(-5, 5);
      fill(55, 30, 100, sparkTimer * 3.3); 
      noStroke();
      ellipse(px, py, random(2, 5), random(2, 5)); 
    }
    sparkTimer--;
  }
}

// ----------------------------------------------------
// wind effect
function drawGridElements() {
  for (let i = 0; i < col; i += 1.2) {
    for (let j = 0; j < row; j += 1.2) {
      let x = i * (width / col);
      let y = j * (height / row);

      let noiseVal = noise(i * 0.01, j * 0.01, frameCount * 0.01);
      let baseAngle = map(noiseVal, 0, 1, -QUARTER_PI, QUARTER_PI);
  
      let d = dist(mouseX, mouseY, x, y);
      let mouse = map(d, 0, 150, 1, 0, true);
        
      let pulse = sin(frameCount * 0.05 + (i + j) * 0.3);
      let angle = lerp(baseAngle, baseAngle - radians(10), mouse);
      let elementLength = 320 + pulse;
  
      let h = map(mouse, 0, 1, 195, 45);
      let s = map(mouse, 0, 1, 45, 80);
      let b = map(mouse, 0, 1, 92, 100);
      let a = map(mouse, 0, 1, 35, 90);

      push();
      translate(x, y);
      rotate(angle);
      noFill();
      stroke(h, s * 0.4, b, a * 0.4);
      strokeWeight(1.2);
      ellipse(0, 0, elementLength * 1.5, elementLength * 0.5);
      stroke(h, s, b, a);
      strokeWeight(map(mouse, 0, 1, 1.2, 2));
      noFill();

      let curveVal = sin(frameCount * 0.05 + i * 0.3 + j * 0.3) * (elementLength * 0.4);

      bezier(-elementLength / 2, 0, -elementLength / 4, curveVal, 
             elementLength / 4, -curveVal, elementLength / 2, 0);
      noStroke();
      fill(h, 20, 100, a);
      ellipse(elementLength / 2, 0, 2 + mouse * 2);
      pop();
    }
  }
}

// ----------------------------------------------------
// create environment
function drawDaytimeSky() {
  for (let y = 0; y < height; y += 4) {
    let inter = map(y, 0, height, 0, 1);
    let h = map(inter, 0, 1, 198, 80);
    let s = map(inter, 0, 1, 40, 15);
    let b = map(inter, 0, 1, 92, 100);
    fill(h, s, b);
    noStroke();
    rect(0, y, width, 4);
  }
}

function drawSunshine() {
  push();
  noStroke();
  fill(45, 20, 100, 20);
  ellipse(width - 80, 60, 320, 320);
  fill(45, 30, 100, 30);
  ellipse(width - 80, 60, 120, 120);
  pop();
}

function drawMountains() {
  push();
  noStroke();
  fill(195, 25, 95, 50);
  for (let x = 0; x <= width; x += 5) {
    let y = 320 + sin(x * 0.008) * 10 + cos(x * 0.015) * 30;
    rect(x, y, 6, height - y);
  }
  fill(190, 35, 88, 65);
  for (let x = 0; x <= width; x += 5) {
    let y = 360 + sin(x * 0.006 + 1.5) * 35 + sin(x * 0.02) * 15;
    rect(x, y, 6, height - y);
  }
  pop();
}

function drawClouds() {
  push();
  drawCloud(cloudX1, 90, 1.0);
  cloudX1 += 0.5; 
  if (cloudX1 > width + 120) cloudX1 = -120;
  drawCloud(cloudX2, 160, 0.7);
  cloudX2 += 0.5; 
  if (cloudX2 > width + 120) cloudX2 = -120;
  pop();
}

function drawCloud(x, y, s) {
  push();
  translate(x, y); 
  noStroke();
  fill(0, 0, 100, 45); 
  rect(-40, -10, 80, 20, 10);
  ellipse(-20, -12, 35, 35);
  ellipse(10, -15, 45, 45);
  pop();
}

function drawFallingPetals() {
  push();
  noStroke();
  fill(340, 45, 95, 70); 

  petalX += 1.2;
  petalY += 0.8;
  if (petalX > width) petalX = -100;
  if (petalY > height) petalY = -100;

  ellipse(petalX + 50,  petalY + 20,  10, 6);
  ellipse(petalX + 180, petalY + 120, 8, 4);
  ellipse(petalX + 450, petalY + 200, 9, 5);
  ellipse(petalX + 600, petalY + 80,  11, 5);
  ellipse(petalX + 120, petalY + 300, 7, 4);
  ellipse(petalX + 380, petalY + 350, 10, 5);
  pop();
}

// ----------------------------------------------------
// draw flower
function drawFlower(x, y, windAngle) {
  push();
  translate(x, y);
  let d = dist(mouseX, mouseY, x, y);
  let hoverScale = map(d, 0, 200, 0.4, 0.15, true);
  scale(hoverScale);
  rotate(windAngle);
  drawStem();
  translate(0, -200);  
  rotate(sin(frameCount * 0.05) * 0.3);
  
  // petal
  fill(50, 25, 100, 85);
  noStroke();
  ellipse(0, 0, 22, 22);

  let petalCount = 6;
  for (let i = 0; i < petalCount; i++) {
    push();
    rotate((TWO_PI / petalCount) * i);
    drawPetal();
    pop();
  }
  pop();
}

  // flower color change
function drawPetal() {
  let t = (sin(frameCount * 0.02) + 1) / 2; 
  let h = map(t, 0, 1, 340, 415) % 360;  
  fill(h, 35, 100, 80);            
  stroke(210, 15, 100, 80);            
  strokeWeight(1.5);
  
  beginShape();
  for (let t = 0; t <= 1; t += 0.05) {
    let px = bezierPoint(0, -35, -45, 0, t);
    let py = bezierPoint(0, -40, -90, -115, t);
    vertex(px, py);
  }
  for (let t = 0; t <= 1; t += 0.05) {
    let px = bezierPoint(0, 40, 30, 0, t);
    let py = bezierPoint(-120, -90, -40, 0, t);
    vertex(px, py);
  }
  endShape(CLOSE);
}
  // stem
function drawStem() {
  stroke(150, 45, 75, 80);
  strokeWeight(3.5);
  noFill();
  beginShape();
  for (let t = 0; t <= 1; t += 0.05) {
    let px = bezierPoint(0, 40, 40, 0, t);
    let py = bezierPoint(0, -80, -150, -220, t);
    vertex(px, py);
  }
  endShape();
}

// ----------------------------------------------------
// butterfly shape and movement
function drawButterfly(index, timer) {
  push();
  let startX = flowerX;
  let startY = flowerY;
  let x = startX + timer * (1 + index * 0.3) + sin(timer * 0.05 + index) * 20;
  let y = startY - timer * (1.2 - index * 0.1) + cos(timer * 0.05 + index) * 15;
  let angle = cos(timer * 0.05 + index) * 0.3; 
  translate(x, y);
  rotate(angle);

  let rawFlap = sin(timer * 0.04 + index * 0.8);
  let flap = map(rawFlap, -1, 1, 0.15, 1.0);

  // body
  fill(0, 0, 92);
  noStroke();
  ellipse(0, 0, 8, 16);
  stroke(0, 0, 100, 80);
  strokeWeight(1);
  line(0, -7, -5, -15);
  line(0, -7, 5, -15);

  // wings
  noStroke();
  let t = (sin(frameCount * 0.02 + index * 0.3) + 1) / 2;
  let h = map(t, 0, 1, 340, 415) % 360;
  fill(h, 35, 100, 80);

  push();
  scale(flap, 1);
  beginShape();
  for (let t = 0; t <= 1; t += 0.05) {
    let px = bezierPoint(0, -25, -30, 0, t);
    let py = bezierPoint(-2, -20, 10, 12, t);
    vertex(px, py);
  }
  endShape(CLOSE);
  pop();

  push();
  scale(-flap, 1);
  beginShape();
  for (let t = 0; t <= 1; t += 0.05) {
    let px = bezierPoint(0, -25, -30, 0, t);
    let py = bezierPoint(-2, -20, 10, 12, t);
    vertex(px, py);
  }
  endShape(CLOSE);
  pop();

  pop();
}

// ----------------------------------------------------
function mousePressed() {
  isDispersed = !isDispersed;
  sparkX = flowerX;
  sparkY = flowerY;
  sparkTimer = 30; 
}