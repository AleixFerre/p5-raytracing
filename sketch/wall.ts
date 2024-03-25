/// <reference path="./segment.ts" />

namespace Custom {
  export class Wall extends Segment {
    p1: p5.Vector;
    p2: p5.Vector;

    constructor(p1: p5.Vector, p2: p5.Vector) {
      super();
      this.p1 = p1;
      this.p2 = p2;
    }

    draw() {
      stroke(10, 10, 235);
      strokeWeight(5);
      line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
  }
}
