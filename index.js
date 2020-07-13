import Vec2 from './Vec2.js';
import PathObj from './PathObj.js';

/**
 * @type {PathObj[]}
 */
let shapes = [];

/**
 * @type {Vec2[]}
 */
let intersects = [];

/**
 * @type {Vec2[]}
 */
let visible = [];

/**
 * @type {Vec2}
 */
let mousePos = new Vec2(0, 0);

/**
 * @type {Number}
 */
const CANVAS_WIDTH = 700;

/**
 * @type {Number}
 */
const CANVAS_HEIGHT = 500;

/**
 * @type {Number}
 */
const MAX_LENGTH = 700;

/**
 * @type {Element}
 */
const canvas = document.querySelector('#mainCanvas');

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

/**
 * Draws a circle
 * @param {Vec2} origin
 * @param {Number} radius
 * @returns {PathObj}
 */
const drawCircle = (name, origin) => {
  const circle = new Path2D();
  circle.arc(origin.x, origin.y, origin.radius, 0, 2 * Math.PI);
  return new PathObj(name, circle, origin);
};

/**
 * @type {PathObj}
 */
let eye;

const moveToEye = () => {
  ctx.moveTo(eye.origin.x, eye.origin.y);
};

const setup = () => {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  eye = drawCircle('eye', new Vec2(100, 100, 10));

  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * CANVAS_WIDTH);
    const y = Math.floor(Math.random() * CANVAS_HEIGHT);
    const circle = drawCircle(`circle${i}`, new Vec2(x, y, 50));
    shapes.push(circle);
  }

  shapes.sort((a, b) => {
    const aDist = a.origin.distance(eye.origin);
    const bDist = b.origin.distance(eye.origin);
    return aDist - bDist;
  });
};

/**
 *
 * @param {Number} angle
 */
const draw = (angle) => {
  // reset canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // draw each shape
  shapes.forEach((s) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.stroke(s.path);
    ctx.closePath();
  });

  // draw line from eye to each shape outer
  // shapes.forEach((s) => {
  //   const length = eye.origin.outerDistance(s.origin);
  //   const theta = eye.origin.getRadTo(s.origin);
  //   const x = eye.origin.x + length * Math.cos(theta);
  //   const y = eye.origin.y + length * Math.sin(theta);
  //   moveToEye();
  //   ctx.lineTo(x, y);
  //   ctx.stroke();
  // });

  const getIntersections = () => {
    const theta = (angle * Math.PI) / 180;
    let x, y;
    for (let i = eye.origin.outerDistance(shapes[0].origin); i <= MAX_LENGTH; i++) {
      x = eye.origin.x + i * Math.cos(theta);
      y = eye.origin.y + i * Math.sin(theta);
      const endPoint = new Vec2(x, y);
      for (let j = 0; j < shapes.length; j++) {
        const s = shapes[j];
        if (s.origin.isInArea(eye.origin)) {
          return;
        }
        if (endPoint.outerDistance(s.origin) < 1 && !s.origin.isInArea(endPoint)) {
          intersects.push(endPoint);
          return;
        }
      }
    }
  };

  const gradLine = (pos) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    const grad = ctx.createLinearGradient(eye.origin.x, eye.origin.y, pos.x, pos.y);
    grad.addColorStop(0, 'white');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    moveToEye();
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.closePath();
  };

  const drawFov = () => {
    let minPos = eye.origin.getPointOnAngleDeg(null, minViewAngle, MAX_LENGTH);
    let maxPos = eye.origin.getPointOnAngleDeg(null, maxViewAngle, MAX_LENGTH);

    gradLine(minPos.pos);
    gradLine(maxPos.pos);
  };

  getIntersections();

  intersects.forEach((i) => {
    const length = eye.origin.outerDistance(i);
    const theta = eye.origin.getRadTo(i);
    const x = eye.origin.x + length * Math.cos(theta);
    const y = eye.origin.y + length * Math.sin(theta);

    const gradX = eye.origin.x + MAX_LENGTH * Math.cos(theta);
    const gradY = eye.origin.y + MAX_LENGTH * Math.sin(theta);
    ctx.beginPath();
    ctx.lineWidth = 0.8;
    let grad = ctx.createLinearGradient(eye.origin.x, eye.origin.y, gradX, gradY);
    grad.addColorStop(0, 'white');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    moveToEye();
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
  });

  drawFov();
  // draw eye
  ctx.fillStyle = 'white';
  ctx.fill(eye.path);
};
let angle = 0;
let minViewAngle, maxViewAngle;

const startLoop = () => {
  setInterval(() => {
    intersects = [];

    // get mouse angle
    const pos = eye.origin.getPointOnAngleDeg(mousePos);
    // get min view angle
    minViewAngle = (pos.angle - 20) % 360;
    // get max view angle
    maxViewAngle = (pos.angle + 20) % 360;

    // loop through visible area and draw
    for (let i = minViewAngle; i < maxViewAngle; i += 0.4) {
      angle = i;
      draw(angle);
    }
  }, 1);
};

window.onload = () => {
  setup();
  startLoop();
};

document.body.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mousePos.x = x;
  mousePos.y = y;

  // sort distances
  shapes.sort((a, b) => {
    const aDist = a.origin.distance(eye.origin);
    const bDist = b.origin.distance(eye.origin);
    return aDist - bDist;
  });
});
