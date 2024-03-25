const RAY_MAX_DISTANCE = 1200;
const RAY_MAX_BOUNCES = 5;
class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = (direction === null || direction === void 0 ? void 0 : direction.normalize()) || createVector();
    }
    setDirectionPoint(lookAtPoint) {
        this.direction = p5.Vector.sub(lookAtPoint, this.origin).normalize();
    }
    draw(walls, depth = 0) {
        stroke('red');
        strokeWeight(10);
        point(this.origin.x, this.origin.y);
        const end = this.calculateIntersectionPoint(walls);
        strokeWeight(1);
        stroke('white');
        line(this.origin.x, this.origin.y, end.point.x, end.point.y);
        if ((end === null || end === void 0 ? void 0 : end.reflection) && depth < RAY_MAX_BOUNCES) {
            end.reflection.draw(walls, depth + 1);
        }
    }
    calculateIntersectionPoint(walls) {
        let intersectionPoint;
        for (const wall of walls) {
            const point = this.getRayToLineSegmentIntersection(wall);
            if (!point)
                continue;
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
        return intersectionPoint !== null && intersectionPoint !== void 0 ? intersectionPoint : this.getLineToInfinity();
    }
    getLineToInfinity() {
        return {
            point: p5.Vector.add(this.origin, p5.Vector.mult(this.direction, RAY_MAX_DISTANCE)),
            distance: Infinity,
            reflection: null
        };
    }
    getReflectionDirection(direction, wall) {
        const wallNormal = createVector(wall.p2.y - wall.p1.y, wall.p1.x - wall.p2.x).normalize();
        return p5.Vector.sub(direction, p5.Vector.mult(wallNormal, 2 * p5.Vector.dot(direction, wallNormal))).normalize();
    }
    getRayToLineSegmentIntersection(wall) {
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
let font;
let fps = 0;
const walls = [];
let ray;
function preload() {
    font = loadFont('assets/Inconsolata-Medium.ttf');
}
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(800, 800, WEBGL);
    walls.push(new Wall(createVector(600, 400), createVector(400, 600)));
    walls.push(new Wall(createVector(200, 400), createVector(400, 600)));
    walls.push(new Wall(createVector(200, 400), createVector(400, 200)));
    walls.push(new Wall(createVector(400, 200), createVector(600, 400)));
    ray = new Ray(createVector(400.1, 400.1));
    textFont(font);
    textSize(32);
}
function draw() {
    background('black');
    translate(-width / 2, -height / 2);
    drawFPS();
    ray.setDirectionPoint(createVector(mouseX, mouseY));
    drawWalls();
    ray.draw(walls);
}
function drawFPS() {
    if (frameCount % 5 === 0)
        fps = floor(frameRate());
    fill('white');
    textAlign(LEFT, TOP);
    text(fps, 5, 5);
}
function drawWalls() {
    stroke('white');
    walls.forEach(wall => {
        wall.draw();
    });
}
class Wall {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    draw() {
        stroke(10, 10, 235);
        strokeWeight(5);
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}
//# sourceMappingURL=build.js.map