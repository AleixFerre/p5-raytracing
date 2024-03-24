let font: p5.Font;

const walls: Wall[] = [];

function preload() {
  font = loadFont('assets/Inconsolata-Medium.ttf');
}

function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  createCanvas(500, 500, WEBGL);

  walls.push(new Wall(
    createVector(100, 60),
    createVector(400, 100),
  ))

  console.log(walls);

  textFont(font);
  textSize(32);
}

function draw() {
  background('black');
  translate(-width / 2, -height / 2);

  fill('white');
  textAlign(LEFT, TOP);
  text(floor(frameRate()), 5, 5);

  textAlign(RIGHT, TOP);

  drawWalls();
}

function drawWalls() {
  stroke('white')
  walls.forEach(wall => {
    wall.draw();
  });
}
