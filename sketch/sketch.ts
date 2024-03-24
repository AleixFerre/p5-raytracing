let font: p5.Font;

let fps = 0;

const walls: Wall[] = [];
let ray: Ray;

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

  ray = new Ray(
    createVector(300, 300),
  )

  textFont(font);
  textSize(32);
}

function draw() {
  background('black');
  translate(-width / 2, -height / 2);
  drawFPS();

  ray.setDirectionPoint(createVector(mouseX, mouseY));

  drawWalls();
  ray.draw(walls);
}

function drawFPS() {
  if (frameCount % 5 === 0)
    fps = floor(frameRate());

  fill('white');
  textAlign(LEFT, TOP);
  text(fps, 5, 5);
}

function drawWalls() {
  stroke('white')
  walls.forEach(wall => {
    wall.draw();
  });
}
