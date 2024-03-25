let font: p5.Font;

let fps = 0;

const AMOUNT_OF_RAYS = 40;

const walls: Custom.Wall[] = [];
const rays: Custom.Ray[] = [];

function preload() {
  font = loadFont('assets/Inconsolata-Medium.ttf');
}

function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  createCanvas(800, 800, WEBGL);

  buildWalls();
  buildRays();

  textFont(font);
  textSize(32);
}

function buildWalls() {
  walls.push(new Custom.Wall(
    createVector(600, 400),
    createVector(400, 600)
  ));

  walls.push(new Custom.Wall(
    createVector(200, 400),
    createVector(400, 600)
  ));

  walls.push(new Custom.Wall(
    createVector(200, 400),
    createVector(400, 200)
  ));

  walls.push(new Custom.Wall(
    createVector(400, 200),
    createVector(600, 400)
  ));
}

function buildRays() {
  for (let angle = 0; angle < TAU; angle += TAU / AMOUNT_OF_RAYS) {
    const newRay = new Custom.Ray(
      createVector(400.1, 400.1)
    )
    newRay.setDirectionFromAngle(angle);
    rays.push(newRay);
  }
}

function draw() {
  background('black');
  translate(-width / 2, -height / 2);
  drawFPS();

  drawWalls();

  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    ray.setDirectionFromAngle(TAU / rays.length * i + frameCount / 1000);
    ray.draw(walls);
  }
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
