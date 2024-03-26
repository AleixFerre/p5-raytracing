let font: p5.Font;

let fps = 0;

const AMOUNT_OF_RAYS = 32;
const AMOUNT_OF_BOUNCES = 50;
const SPEED = 50;

const W_ROOM = 150 // smaller than H_ROOM pls
const H_ROOM = 200
const S_ROOM = 200

const F_ROOM = Math.sqrt(H_ROOM*H_ROOM-W_ROOM*W_ROOM)

const segments: Custom.Segment[] = [];
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

  segments.push(new Custom.Elipse(
    createVector(400+S_ROOM/2, 400),
    W_ROOM*2,
    H_ROOM*2,
    1 // 
  ));
  segments.push(new Custom.Elipse(
    createVector(400-S_ROOM/2, 400),
    W_ROOM*2,
    H_ROOM*2,
    -1 // 
  ));

  // segments.push(new Custom.Wall(
  //   createVector(0, 0),
  //   createVector(0, 800)
  // ));

  // segments.push(new Custom.Wall(
  //   createVector(0, 800),
  //   createVector(800, 800)
  // ));

  // segments.push(new Custom.Wall(
  //   createVector(800, 800),
  //   createVector(800, 0)
  // ));

  // segments.push(new Custom.Wall(
  //   createVector(800, 0),
  //   createVector(0, 0)
  // ));

  segments.push(new Custom.Wall(
    createVector(400-S_ROOM/2, 400+H_ROOM),
    createVector(400+S_ROOM/2, 400+H_ROOM)
  ));
  segments.push(new Custom.Wall(
    createVector(400-S_ROOM/2, 400-H_ROOM),
    createVector(400+S_ROOM/2, 400-H_ROOM)
  ));
  segments.push(new Custom.Wall(
    createVector(400-S_ROOM/2, 400-F_ROOM),
    createVector(400+S_ROOM/2, 400-F_ROOM)
  ));
  segments.push(new Custom.Wall(
    createVector(400-S_ROOM/2, 400+F_ROOM),
    createVector(400+S_ROOM/2, 400+F_ROOM)
  ));
  segments.push(new Custom.Wall(
    createVector(400, 400+F_ROOM),
    createVector(400, 400+H_ROOM)
  ));
  segments.push(new Custom.Wall(
    createVector(400, 400-F_ROOM),
    createVector(400, 400-H_ROOM)
  ));
  console.log(F_ROOM);
}

function buildRays() {
  rays.length = 0;
  for (let angle = 0; angle < TAU; angle += TAU / AMOUNT_OF_RAYS) {
    const newRay = new Custom.Ray(
      createVector(mouseX, mouseY)
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
  buildRays();

  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    ray.setDirectionFromAngle(TAU / rays.length * i + frameCount / 100000 * SPEED);
    ray.draw(segments);
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
  segments.forEach(wall => {
    wall.draw();
  });
}
