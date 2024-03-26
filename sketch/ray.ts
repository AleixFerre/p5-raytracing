const RAY_MAX_DISTANCE = 1200;

namespace Custom {
  interface IntersectionPointInfo {
    point: p5.Vector;
    distance: number;
    reflection: Ray;
  }

  export class Ray {
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

    draw(segments: Custom.Segment[], depth: number = 0) {
      stroke('red');
      strokeWeight(10);
      point(this.origin.x, this.origin.y);

      const end: IntersectionPointInfo = this.calculateIntersectionPoint(segments);
      strokeWeight(1);
      stroke("white");
      line(this.origin.x, this.origin.y, end.point.x, end.point.y);

      if (end?.reflection && depth < raysBouncesInfo.slider.value()) {
        end.reflection.draw(segments, depth + 1);
      }
    }

    private calculateIntersectionPoint(segments: Custom.Segment[]): IntersectionPointInfo {
      let intersectionPoint: IntersectionPointInfo;
      for (const segment of segments) {
        const point = segment.intersection(this);
        if (!point) continue;

        const distance = p5.Vector.dist(this.origin, point);
        const reflection = new Ray(p5.Vector.add(point, this.direction.copy().mult(-0.00001)), segment.reflection(this));

        if (!intersectionPoint || distance < intersectionPoint.distance) {
          intersectionPoint = {
            distance,
            point,
            reflection,
          };
        }
      }
      return intersectionPoint ?? this.getLineToInfinity();
    }

    private getLineToInfinity(): IntersectionPointInfo {
      const movement = this.direction.copy().mult(RAY_MAX_DISTANCE);
      return {
        point: p5.Vector.add(this.origin, movement),
        distance: Infinity,
        reflection: null,
      };
    }
  }
}
