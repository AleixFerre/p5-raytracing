class Wall {
  p1: p5.Vector;
  p2: p5.Vector;

  constructor(p1: p5.Vector, p2: p5.Vector) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw() {
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }
}
