/// <reference path="./segment.ts" />

namespace Custom {
  export class Wall extends Segment {
    p1: p5.Vector;
    p2: p5.Vector;
    readonly wallNormal: p5.Vector;

    constructor(p1: p5.Vector, p2: p5.Vector) {
      super();
      this.p1 = p1;
      this.p2 = p2;
      this.wallNormal = createVector(this.p2.y - this.p1.y, this.p1.x - this.p2.x).normalize();
    }

    override draw(): void {
      img.stroke(10, 10, 235);
      img.strokeWeight(5);
      img.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }

    override intersection(ray: Ray): p5.Vector | null {
      const x1 = this.p1.x;
      const y1 = this.p1.y;
      const x2 = this.p2.x;
      const y2 = this.p2.y;

      const x3 = ray.origin.x;
      const y3 = ray.origin.y;
      const x4 = ray.origin.x + ray.direction.x;
      const y4 = ray.origin.y + ray.direction.y;

      const x12 = x1 - x2;
      const y34 = y3 - y4;
      const y12 = y1 - y2;
      const x34 = x3 - x4;

      const den = x12 * y34 - y12 * x34;

      if (den == 0) {
        return null;
      }

      const y13 = y1 - y3;
      const x13 = x1 - x3;

      const t = (x13 * y34 - y13 * x34) / den;
      const u = -(x12 * y13 - y12 * x13) / den;

      if (t >= 0 && t <= 1 && u > 0) {
        return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
      }

      return null;
    }

    override reflection(ray: Ray): p5.Vector | null {
      const movement = this.wallNormal.copy().mult(2 * p5.Vector.dot(ray.direction, this.wallNormal));
      return p5.Vector.sub(ray.direction, movement).normalize();
    }
  }
}
