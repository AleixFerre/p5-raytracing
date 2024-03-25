const RAY_MAX_DISTANCE = 1200;
const RAY_MAX_BOUNCES = 1;

interface IntersectionPointInfo {
  point: p5.Vector;
  distance: number;
  reflection: Ray;
}

class Ray {
  origin: p5.Vector;
  direction: p5.Vector;

  constructor(origin: p5.Vector, direction?: p5.Vector) {
    this.origin = origin;
    this.direction = direction?.normalize() || createVector();
  }

  setDirectionPoint(lookAtPoint: p5.Vector) {
    this.direction = p5.Vector.sub(lookAtPoint, this.origin).normalize();
  }

  setDirectionFromAngle(angle: number) {
    this.direction = p5.Vector.fromAngle(angle);
  }

  draw(walls: Wall[], depth: number = 0) {
    stroke('red');
    strokeWeight(10);
    point(this.origin.x, this.origin.y);

    const end: IntersectionPointInfo = this.calculateIntersectionPoint(walls);
    strokeWeight(1);
    stroke('white');
    line(this.origin.x, this.origin.y, end.point.x, end.point.y);

    if (end?.reflection && depth < RAY_MAX_BOUNCES) {
      end.reflection.draw(walls, depth + 1);
    }
  }

  private calculateIntersectionPoint(walls: Wall[]): IntersectionPointInfo {
    let intersectionPoint: IntersectionPointInfo;
    for (const wall of walls) {
      const point = this.getRayToLineSegmentIntersection(wall);
      if (!point) continue;

      const distance = p5.Vector.dist(this.origin, point);
      const reflection = new Ray(point, this.getReflectionDirection(this.direction, wall));

      if (!intersectionPoint || distance < intersectionPoint.distance) {
        intersectionPoint = {
          distance,
          point,
          reflection
        };
      }
    }
    return intersectionPoint ?? this.getLineToInfinity();
  }

  private getLineToInfinity(): IntersectionPointInfo {
    return {
      point: p5.Vector.add(this.origin, p5.Vector.mult(this.direction, RAY_MAX_DISTANCE)),
      distance: Infinity,
      reflection: null
    }
  }

  private getReflectionDirection(direction: p5.Vector, wall: Wall): p5.Vector {
    const wallNormal = createVector(wall.p2.y - wall.p1.y, wall.p1.x - wall.p2.x).normalize();
    return p5.Vector.sub(direction, p5.Vector.mult(wallNormal, 2 * p5.Vector.dot(direction, wallNormal))).normalize();
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

    if (t >= 0 && t <= 1 && u > 0.0000001) {
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }

    return null;
  }
}
