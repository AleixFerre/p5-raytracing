let font: p5.Font;

let fps = 0;
let img: p5.Graphics;

const SPEED = 50;

const W_ROOM = 150; // smaller than H_ROOM pls
const H_ROOM = 200;
const S_ROOM = 200;

const F_ROOM = Math.sqrt(H_ROOM * H_ROOM - W_ROOM * W_ROOM);

const segments: Custom.Segment[] = [];
const rays: Custom.Ray[] = [];

interface SliderInfo {
  slider: any;
  sliderValue: any;
}

const raysAmountInfo: SliderInfo = {
  slider: null,
  sliderValue: null,
};
const raysBouncesInfo: SliderInfo = {
  slider: null,
  sliderValue: null,
};

function preload() {
  font = loadFont('assets/Inconsolata-Medium.ttf');
}

function setup() {
  console.log('🚀 - Setup initialized - P5 is running');
  createCanvas(800, 800, WEBGL);
  background(150, 100, 100);
  img = createGraphics(width, height, WEBGL);

  textFont(font);
  textSize(32);

  raysAmountInfo.slider = createSlider(1, 100, 5, 1);
  raysAmountInfo.sliderValue = createDiv('Number of rays:');

  raysBouncesInfo.slider = createSlider(1, 100, 10, 1);
  raysBouncesInfo.sliderValue = createDiv('Number of bounces:');

  buildWalls();
}

function buildWalls() {
  segments.push(new Custom.Elipse(createVector(S_ROOM / 2, 0), W_ROOM * 2, H_ROOM * 2, 1));
  segments.push(new Custom.Elipse(createVector(-S_ROOM / 2, 0), W_ROOM * 2, H_ROOM * 2, -1));
  segments.push(new Custom.Wall(createVector(-S_ROOM / 2, H_ROOM), createVector(S_ROOM / 2, H_ROOM)));
  segments.push(new Custom.Wall(createVector(-S_ROOM / 2, -H_ROOM), createVector(S_ROOM / 2, -H_ROOM)));
  segments.push(new Custom.Wall(createVector(-S_ROOM / 2, -F_ROOM), createVector(S_ROOM / 2, -F_ROOM)));
  segments.push(new Custom.Wall(createVector(-S_ROOM / 2, F_ROOM), createVector(S_ROOM / 2, F_ROOM)));
  segments.push(new Custom.Wall(createVector(0, F_ROOM), createVector(0, H_ROOM)));
  segments.push(new Custom.Wall(createVector(0, -F_ROOM), createVector(0, -H_ROOM)));
}

function buildRays() {
  rays.length = 0;
  for (let angle = 0; angle < TAU; angle += TAU / raysAmountInfo.slider.value()) {
    const newRay = new Custom.Ray(createVector(mouseX - width / 2, mouseY - height / 2));
    newRay.setDirectionFromAngle(angle);
    rays.push(newRay);
  }
}

function draw() {
  img.background(0, 20);
  // drawFPS();

  drawWalls();

  updateSliders();
  buildRays();

  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    ray.setDirectionFromAngle((TAU / rays.length) * i + (frameCount / 100000) * SPEED);
    ray.draw(segments);
  }

  image(img, -width / 2, -height / 2);
}

function updateSliders() {
  raysAmountInfo.sliderValue.html(`Number of rays: ${raysAmountInfo.slider.value()}`);
  raysBouncesInfo.sliderValue.html(`Number of bounces: ${raysBouncesInfo.slider.value()}`);
}

function drawFPS() {
  if (frameCount % 5 === 0) fps = floor(frameRate());

  fill('white');
  textAlign(LEFT, TOP);
  text(fps, 5 - width / 2, 5 - height / 2);
}

function drawWalls() {
  img.stroke('white');
  segments.forEach(wall => {
    wall.draw();
  });
}
