const RAY_MAX_DISTANCE = 500;

class Ray {
  origin: p5.Vector;
  direction: p5.Vector;

  constructor(origin: p5.Vector, direction?: p5.Vector) {
    this.origin = origin;
    this.direction = direction || createVector();
  }

  setDirectionPoint(lookAtPoint: p5.Vector) {
    this.direction = p5.Vector.sub(lookAtPoint, this.origin).normalize();
  }

  draw(walls: Wall[]) {
    stroke('red');
    strokeWeight(10);
    point(this.origin.x, this.origin.y);

    const end: p5.Vector = this.calculateIntersectionPoint(walls);
    strokeWeight(1);
    stroke('white');
    line(this.origin.x, this.origin.y, end.x, end.y);
  }

  private calculateIntersectionPoint(walls: Wall[]): p5.Vector {
    const intersectionPoint = this.getRayToLineSegmentIntersection(walls[0]);
    return intersectionPoint || p5.Vector.add(this.origin, p5.Vector.mult(this.direction, RAY_MAX_DISTANCE));
  }

  private getRayToLineSegmentIntersection(wall: Wall): p5.Vector | null {
    const x1 = wall.p1.x;
    const y1 = wall.p1.y;
    const x2 = wall.p2.x;
    const y2 = wall.p2.y;

    const x3 = this.origin.x;
    const y3 = this.origin.y;
    const x4 = this.origin.x + this.direction.x;
    const y4 = this.origin.y + this.direction.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (den == 0) {
      return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }

    return null;
  }
}
