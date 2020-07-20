import Vec2 from './Vec2.js';
import { Shape, Circle, Rectangle } from './Shape.js';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;

const CAMERA_RADIUS = 10;
const CAMERA_POS_X = 300;
const CAMERA_POS_Y = 150;

const MAX_SHAPE_COUNT = 5;

const MAX_VISION_DISTANCE = 1000;
const MAX_DEPTH_SEARCH = 20;

const MAX_TOLERANCE = 400;
const MIN_TOLERANCE = 0.1;

const ANGLE_START = 45;
const ANGLE_INCREMENTS = 1;

const COLOR_FILL_SHAPE = 'rgba(0, 0, 0, 1)';
const COLOR_LINE = 'rgba(100, 100, 100, 0.5)';
const COLOR_HIT = 'rgba(255, 180, 0, 0.5)';
const COLOR_FILL_CIRCLE = 'rgba(40, 40, 40, 0.3)';
const COLOR_STROKE_CIRCLE = 'rgba(100, 100, 100, 0.5)';
const COLOR_FILL_CAMERA = 'rgba(155, 155, 155, 1)';

const DEBUG_CIRCLES = true;

/**
 * Hit Layer
 * @type {HTMLCanvasElement}
 */
const hitCanvas = document.querySelector('#hitCanvas');
/**
 * Canvas Context
 * @type {CanvasRenderingContext2D}
 */
const hitCtx = hitCanvas.getContext('2d');

/**
 * Camera Layer
 * @type {HTMLCanvasElement}
 */
const cameraCanvas = document.querySelector('#cameraCanvas');
/**
 * Canvas Context
 * @type {CanvasRenderingContext2D}
 */
const camCtx = cameraCanvas.getContext('2d');

/**
 * Shape Layer
 * @type {HTMLCanvasElement}
 */
const shapeCanvas = document.querySelector('#shapeCanvas');
/**
 * Canvas Context
 * @type {CanvasRenderingContext2D}
 */
const shapeCtx = shapeCanvas.getContext('2d');

hitCanvas.width = CANVAS_WIDTH;
hitCanvas.height = CANVAS_HEIGHT;

cameraCanvas.width = CANVAS_WIDTH;
cameraCanvas.height = CANVAS_HEIGHT;

shapeCanvas.width = CANVAS_WIDTH;
shapeCanvas.height = CANVAS_HEIGHT;

/**
 * Array of shapes in scene
 * @type {Shape[]}
 */
let shapes = [];

/**
 * Array of hit positions
 * @type {Vec2[]}
 */
let hits = [];

/**
 * Camera object
 * @type {Circle}
 */
let camera = new Circle(new Vec2(CAMERA_POS_X, CAMERA_POS_Y), CAMERA_RADIUS);

/**
 * End position of ray line
 * @type {Vec2}
 */
let linePos = new Vec2(100, 100);

/**
 * @type {Number}
 */
let currentAngle = ANGLE_START;

/**
 * Move context position to the camera
 * @type {Function}
 */
const moveToCamera = (ctx) => {
  ctx.moveTo(camera.origin.x, camera.origin.y);
};

/**
 * Sorts shapes by distance to v
 * @param {Vec2} v
 */
const sortShapes = (v) => {
  // sort distances
  shapes.sort((a, b) => {
    const aDist = a.origin.distance(v);
    const bDist = b.origin.distance(v);
    return aDist - bDist;
  });
};

/**
 * Gets the distance to closest object on the scene to v
 * @param {Vec2} v
 * @returns Number distance
 */
const distanceToScene = (v) => {
  // keep track of closest distance - init with max dist
  let distToScene = MAX_VISION_DISTANCE;
  shapes.forEach((s) => {
    // calc distance from v to s
    const dist = s.outerDistance(v);
    // set distToScene to the minimum of the two
    distToScene = Math.min(dist, distToScene);
  });

  return distToScene;
};

/**
 * Draws a Path2D circle on a position with a radius
 * @param {Vec2} pos
 * @param {Number} radius
 */
const drawCircle = (ctx, pos, radius) => {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = COLOR_FILL_CIRCLE;
  ctx.fill();
  ctx.strokeStyle = COLOR_STROKE_CIRCLE;
  ctx.stroke();
  ctx.closePath();
};

/**
 * Draws a Path2D circle on a position
 * @param {Vec2} pos
 */
const drawHit = (pos) => {
  hitCtx.beginPath();
  hitCtx.arc(pos.pos.x, pos.pos.y, 1, 0, 2 * Math.PI);
  hitCtx.fillStyle = COLOR_HIT;
  hitCtx.fill();
  hitCtx.closePath();
};

const drawBackground = () => {
  hitCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  camCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

/**
 * Reset Scene
 * @type {Function}
 */
const reset = () => {
  // reset scene
  drawBackground();

  hitCtx.beginPath();
  camCtx.beginPath();

  hits = [];
  shapes = [];
  setup();
  currentAngle = ANGLE_START;
};

/**
 * Setup Scene
 * @type {Function}
 */
const setup = () => {
  drawBackground();

  // generate random circles
  for (let i = 0; i < MAX_SHAPE_COUNT; i++) {
    const x = Math.floor(Math.random() * CANVAS_WIDTH);
    const y = Math.floor(Math.random() * CANVAS_HEIGHT);
    const origin = new Vec2(x, y);
    const circle = new Circle(origin, 50);
    shapes.push(circle);
  }

  // generate random rectangles
  for (let i = 0; i < MAX_SHAPE_COUNT; i++) {
    const x = Math.floor(Math.random() * CANVAS_WIDTH);
    const y = Math.floor(Math.random() * CANVAS_HEIGHT);
    const width = Math.floor(Math.random() * 300) + 10;
    const height = Math.floor(Math.random() * 300) + 10;
    const origin = new Vec2(x, y);
    const rectangle = new Rectangle(origin, width, height);
    shapes.push(rectangle);
  }

  sortShapes(camera.origin);
  shapeCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  shapes.forEach((s) => {
    shapeCtx.beginPath();
    // draw all the shapes
    shapeCtx.fillStyle = COLOR_FILL_SHAPE;
    shapeCtx.fill(s.path);
    shapeCtx.closePath();
  });
};

/**
 * Render Scene
 * @type {Function}
 */
const render = (angle) => {
  // get point on path from current angle
  const pointOnAngle = camera.origin.getPointOnAngleDeg(null, angle, MAX_VISION_DISTANCE);

  shapes.forEach((s) => {
    if (s.outerDistance(camera.origin) <= MIN_TOLERANCE) {
      reset();
    }

    // set initial origin of search
    let origin = camera.origin;
    // get distance of closest object to origin
    let dist = distanceToScene(camera.origin);
    if (dist < MIN_TOLERANCE) {
      return;
    }
    // draw range
    if (DEBUG_CIRCLES) {
      drawCircle(camCtx, origin, dist);
    }

    // perform sphere tracing algorithm
    for (let i = 0; i < MAX_DEPTH_SEARCH; i++) {
      // reset origin
      if (i === 0) {
        origin = camera.origin;
      }
      // get point on angle at last distance
      const point = origin.extend(pointOnAngle, dist);
      // calculate closest object to new point
      dist = distanceToScene(point);

      // skip open areas
      if (dist > MAX_TOLERANCE) {
        continue;
      }

      // if we're very close to an object, we've hit
      if (dist < MIN_TOLERANCE) {
        hits.push({ pos: point, dist: dist });
        return;
      }
      // draw debug circles
      if (DEBUG_CIRCLES) {
        drawCircle(camCtx, point, dist);
      }
      // set origin to last point
      origin = point;
    }
  });

  // draw the hits
  hits.forEach((h) => {
    drawHit(h);
  });

  // set line pos to point on angle
  linePos = pointOnAngle;

  // draw line from camera to linePos
  if (linePos) {
    camCtx.beginPath();
    moveToCamera(camCtx);
    camCtx.strokeStyle = COLOR_LINE;
    camCtx.lineWidth = 2;
    camCtx.lineTo(linePos.x, linePos.y);
    camCtx.stroke();
    camCtx.closePath();
  }

  // draw camera
  camCtx.fillStyle = COLOR_FILL_CAMERA;
  camCtx.fill(camera.path);
};

window.onload = (e) => {
  // setup scene
  setup();
  // main loop
  const loop = () => {
    drawBackground();
    // reset scene if we've searched every angle
    if (currentAngle === ANGLE_START + 360) {
      reset();
    }
    // render the scene
    render(currentAngle);
    // increment current angle
    currentAngle += ANGLE_INCREMENTS;

    window.requestAnimationFrame(loop);
  };

  window.requestAnimationFrame(loop);
};

// window.onmousemove = (e) => {
//   const rect = canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
//   linePos = new Vec2(x, y);
//   linePos = camera.origin.extend(linePos, MAX_DISTANCE);
// };

document.onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // reset hits
  hits = [];
};
