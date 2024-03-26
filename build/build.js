var Custom;
(function (Custom) {
    class Segment {
    }
    Custom.Segment = Segment;
})(Custom || (Custom = {}));
var Custom;
(function (Custom) {
    class Elipse extends Custom.Segment {
        constructor(center, width, height, half) {
            super();
            this.center = center;
            this.width = width;
            this.height = height;
            this.half = half;
        }
        draw() {
            stroke(10, 10, 235);
            strokeWeight(5);
            noFill();
            const plus = this.half > 0 ? PI : 0;
            arc(this.center.x, this.center.y, this.width, this.height, PI / 2 + plus, PI + PI / 2 + plus, OPEN, 50);
        }
        intersection(ray) {
            const cx = this.center.x;
            const cy = this.center.y;
            const a = this.width / 2;
            const b = this.height / 2;
            const xo = ray.origin.x - cx;
            const yo = ray.origin.y - cy;
            const xd = ray.direction.x;
            const yd = ray.direction.y;
            const A = (xd * xd) / (a * a) + (yd * yd) / (b * b);
            const B = (2 * (xo * xd)) / (a * a) + (2 * (yo * yd)) / (b * b);
            const C = (xo * xo) / (a * a) + (yo * yo) / (b * b) - 1;
            const discriminant = B * B - 4 * A * C;
            if (discriminant > 0) {
                const ssq = sqrt(discriminant);
                const t1 = (-B + ssq) / (2 * A);
                const t2 = (-B - ssq) / (2 * A);
                if (t1 >= 0 && t2 >= 0) {
                    const x1 = ray.origin.x + t1 * xd;
                    const y1 = ray.origin.y + t1 * yd;
                    const aA = createVector(x1, y1);
                    const x2 = ray.origin.x + t2 * xd;
                    const y2 = ray.origin.y + t2 * yd;
                    const bB = createVector(x2, y2);
                    let toReturn = bB;
                    if ((this.half > 0 && x2 < this.center.x) || (this.half < 0 && x2 > this.center.x)) {
                        toReturn = aA;
                        if ((this.half > 0 && x1 < this.center.x) || (this.half < 0 && x1 > this.center.x)) {
                            toReturn = null;
                        }
                    }
                    return toReturn;
                }
                const x1 = ray.origin.x + t1 * xd;
                if (t1 >= 0 && ((this.half > 0 && x1 > this.center.x) || (this.half < 0 && x1 < this.center.x))) {
                    const y1 = ray.origin.y + t1 * yd;
                    return createVector(x1, y1);
                }
            }
            return null;
        }
        reflection(ray) {
            const point = this.intersection(ray);
            const normal = this.normalAtIntersection(point);
            const movement = normal.copy().mult(2 * p5.Vector.dot(ray.direction, normal));
            return p5.Vector.sub(ray.direction, movement).normalize();
        }
        normalAtIntersection(intersectionPoint) {
            const cx = this.center.x;
            const cy = this.center.y;
            const a = this.width / 2;
            const b = this.height / 2;
            const dFx = (-2 * (intersectionPoint.x - cx)) / (a * a);
            const dFy = (-2 * (intersectionPoint.y - cy)) / (b * b);
            const nx = dFy;
            const ny = -dFx;
            const length = sqrt(nx * nx + ny * ny);
            return createVector(-ny / length, nx / length);
        }
    }
    Custom.Elipse = Elipse;
})(Custom || (Custom = {}));
const RAY_MAX_DISTANCE = 1200;
var Custom;
(function (Custom) {
    class Ray {
        constructor(origin, direction) {
            this.origin = origin;
            this.direction = (direction === null || direction === void 0 ? void 0 : direction.normalize()) || createVector();
        }
        setDirectionPoint(lookAtPoint) {
            this.direction = p5.Vector.sub(lookAtPoint, this.origin).normalize();
        }
        setDirectionFromAngle(angle) {
            this.direction = p5.Vector.fromAngle(angle);
        }
        draw(segments, depth = 0) {
            stroke('red');
            strokeWeight(10);
            point(this.origin.x, this.origin.y);
            const end = this.calculateIntersectionPoint(segments);
            strokeWeight(1);
            stroke("white");
            line(this.origin.x, this.origin.y, end.point.x, end.point.y);
            if ((end === null || end === void 0 ? void 0 : end.reflection) && depth < raysBouncesInfo.slider.value()) {
                end.reflection.draw(segments, depth + 1);
            }
        }
        calculateIntersectionPoint(segments) {
            let intersectionPoint;
            for (const segment of segments) {
                const point = segment.intersection(this);
                if (!point)
                    continue;
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
            return intersectionPoint !== null && intersectionPoint !== void 0 ? intersectionPoint : this.getLineToInfinity();
        }
        getLineToInfinity() {
            const movement = this.direction.copy().mult(RAY_MAX_DISTANCE);
            return {
                point: p5.Vector.add(this.origin, movement),
                distance: Infinity,
                reflection: null,
            };
        }
    }
    Custom.Ray = Ray;
})(Custom || (Custom = {}));
let font;
let fps = 0;
const SPEED = 50;
const W_ROOM = 150;
const H_ROOM = 200;
const S_ROOM = 200;
const F_ROOM = Math.sqrt(H_ROOM * H_ROOM - W_ROOM * W_ROOM);
const segments = [];
const rays = [];
const raysAmountInfo = {
    slider: null,
    sliderValue: null,
};
const raysBouncesInfo = {
    slider: null,
    sliderValue: null,
};
function preload() {
    font = loadFont("assets/Inconsolata-Medium.ttf");
}
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(800, 800, WEBGL);
    textFont(font);
    textSize(32);
    raysAmountInfo.slider = createSlider(1, 100, 5, 1);
    raysAmountInfo.sliderValue = createDiv("Number of rays:");
    raysBouncesInfo.slider = createSlider(1, 100, 10, 1);
    raysBouncesInfo.sliderValue = createDiv("Number of bounces:");
    buildWalls();
}
function buildWalls() {
    segments.push(new Custom.Elipse(createVector(400 + S_ROOM / 2, 400), W_ROOM * 2, H_ROOM * 2, 1));
    segments.push(new Custom.Elipse(createVector(400 - S_ROOM / 2, 400), W_ROOM * 2, H_ROOM * 2, -1));
    segments.push(new Custom.Wall(createVector(400 - S_ROOM / 2, 400 + H_ROOM), createVector(400 + S_ROOM / 2, 400 + H_ROOM)));
    segments.push(new Custom.Wall(createVector(400 - S_ROOM / 2, 400 - H_ROOM), createVector(400 + S_ROOM / 2, 400 - H_ROOM)));
    segments.push(new Custom.Wall(createVector(400 - S_ROOM / 2, 400 - F_ROOM), createVector(400 + S_ROOM / 2, 400 - F_ROOM)));
    segments.push(new Custom.Wall(createVector(400 - S_ROOM / 2, 400 + F_ROOM), createVector(400 + S_ROOM / 2, 400 + F_ROOM)));
    segments.push(new Custom.Wall(createVector(400, 400 + F_ROOM), createVector(400, 400 + H_ROOM)));
    segments.push(new Custom.Wall(createVector(400, 400 - F_ROOM), createVector(400, 400 - H_ROOM)));
}
function buildRays() {
    rays.length = 0;
    for (let angle = 0; angle < TAU; angle += TAU / raysAmountInfo.slider.value()) {
        const newRay = new Custom.Ray(createVector(mouseX, mouseY));
        newRay.setDirectionFromAngle(angle);
        rays.push(newRay);
    }
}
function draw() {
    background("black");
    translate(-width / 2, -height / 2);
    drawFPS();
    drawWalls();
    updateSliders();
    buildRays();
    for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];
        ray.setDirectionFromAngle((TAU / rays.length) * i + (frameCount / 100000) * SPEED);
        ray.draw(segments);
    }
}
function updateSliders() {
    raysAmountInfo.sliderValue.html(`Number of rays: ${raysAmountInfo.slider.value()}`);
    raysBouncesInfo.sliderValue.html(`Number of bounces: ${raysBouncesInfo.slider.value()}`);
}
function drawFPS() {
    if (frameCount % 5 === 0)
        fps = floor(frameRate());
    fill("white");
    textAlign(LEFT, TOP);
    text(fps, 5, 5);
}
function drawWalls() {
    stroke("white");
    segments.forEach((wall) => {
        wall.draw();
    });
}
var Custom;
(function (Custom) {
    class Wall extends Custom.Segment {
        constructor(p1, p2) {
            super();
            this.p1 = p1;
            this.p2 = p2;
            this.wallNormal = createVector(this.p2.y - this.p1.y, this.p1.x - this.p2.x).normalize();
        }
        draw() {
            stroke(10, 10, 235);
            strokeWeight(5);
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        }
        intersection(ray) {
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
        reflection(ray) {
            const movement = this.wallNormal.copy().mult(2 * p5.Vector.dot(ray.direction, this.wallNormal));
            return p5.Vector.sub(ray.direction, movement).normalize();
        }
    }
    Custom.Wall = Wall;
})(Custom || (Custom = {}));
//# sourceMappingURL=build.js.map