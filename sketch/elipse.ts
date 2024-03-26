/// <reference path="./segment.ts" />

namespace Custom {
  export class Elipse extends Segment {
    center: p5.Vector;
    width: number;
    height: number;

    constructor(center: p5.Vector, width: number, height: number) {
      super();
      this.center = center;
      this.width = width;
      this.height = height;
    }

    override draw(): void {
      stroke(10, 10, 235);
      strokeWeight(5);
      noFill();
      ellipse(this.center.x, this.center.y, this.width, this.height, 50)
    }

    override intersection(ray: Ray): p5.Vector | null {
      const cx = this.center.x;
      const cy = this.center.y;
      const a = this.width / 2;
      const b = this.height / 2;

      const xo = ray.origin.x - cx;
      const yo = ray.origin.y - cy;
      const xd = ray.direction.x;
      const yd = ray.direction.y;

      const A = (xd * xd) / (a * a) + (yd * yd) / (b * b);
      const B = 2 * (xo * xd) / (a * a) + 2 * (yo * yd) / (b * b);
      const C = (xo * xo) / (a * a) + (yo * yo) / (b * b) - 1;
      
      const discriminant = B * B - 4 * A * C;
      
      if (discriminant === 0) {
          const t = -B / (2 * A);
          if (t >= 0) {
              const x = ray.origin.x + t * xd;
              const y = ray.origin.y + t * yd;
              return createVector(x,y);
          }
      } else if (discriminant > 0) {
          const t1 = (-B + sqrt(discriminant)) / (2 * A);
          const t2 = (-B - sqrt(discriminant)) / (2 * A);
          if(t1 >= 0 && t2 >= 0){
            const x1 = ray.origin.x + t1 * xd;
            const y1 = ray.origin.y + t1 * yd;
            const aA =  createVector(x1,y1);
            const x2 = ray.origin.x + t2 * xd;
            const y2 = ray.origin.y + t2 * yd;
            const bB = createVector(x2,y2);
            return aA.dist(ray.origin) < bB.dist(ray.origin) ? aA : bB;
          }
          if (t1 >= 0) {
              const x1 = ray.origin.x + t1 * xd;
              const y1 = ray.origin.y + t1 * yd;
              return createVector(x1,y1);
          }
          if (t2 >= 0) {
              const x2 = ray.origin.x + t2 * xd;
              const y2 = ray.origin.y + t2 * yd;
              return createVector(x2,y2);
          }
      }

      return null;
    }

    override reflection(ray: Ray): p5.Vector | null {
      const point = this.intersection(ray);
      const normal = this.normalAtIntersection(point);
      const movement = normal.copy().mult(2 * p5.Vector.dot(ray.direction, normal));
      return p5.Vector.sub(ray.direction, movement).normalize();
    }

    normalAtIntersection(intersectionPoint: p5.Vector): p5.Vector {
      const cx = this.center.x;
      const cy = this.center.y;
      const a = this.width / 2;
      const b = this.height / 2;

      // Partial derivatives of the ellipse equation
      const dFx = -2 * (intersectionPoint.x - cx) / (a * a);
      const dFy = -2 * (intersectionPoint.y - cy) / (b * b);
      
      // Normal vector components
      const nx = dFy;
      const ny = -dFx;
      
      // Normalize the normal vector
      const length = sqrt(nx * nx + ny * ny);
      return createVector(-ny / length, nx / length);
    }

  }
}
