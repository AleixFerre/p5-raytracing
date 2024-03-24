let font: p5.Font;

function preload() {
  font = loadFont('assets/Inconsolata-Medium.ttf');
}

function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  createCanvas(500, 500, WEBGL);

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
}
