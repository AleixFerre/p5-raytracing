const RayDistance = 500;

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
    return p5.Vector.add(this.origin, p5.Vector.mult(this.direction, RayDistance))
  }
}
