import Vec2 from './Vec2.js';

/**
 * Class representing a Shape
 */
export class Shape {
  /**
   * @param {Vec2} origin
   */
  constructor(origin) {
    this.origin = origin || new Vec2();
    this.path = new Path2D();
  }
}

/**
 * Class representing a Rectangle
 * @extends {Shape}
 */
export class Rectangle extends Shape {
  /**
   * @param {Vec2} origin - The top left point
   * @param {Number} width
   * @param {Number} height
   */
  constructor(origin, width, height) {
    super(origin);
    this.width = width;
    this.height = height;
    this.path.rect(this.origin.x, this.origin.y, this.width, this.height);
  }

  /**
   * Get center position of Rectangle
   * @returns {Vec2} New position
   */
  center() {
    const x = this.origin.x + this.width / 2;
    const y = this.origin.y + this.height / 2;
    return new Vec2(x, y);
  }

  /**
   * Gets the distance to the closest edge point from a Vec2
   * @param {Vec2} v - Other Vec2
   * @returns {Number} - Distance
   */
  outerDistance(v) {
    var cx = Math.max(Math.min(v.x, this.origin.x + this.width), this.origin.x);
    var cy = Math.max(Math.min(v.y, this.origin.y + this.height), this.origin.y);
    return Math.sqrt(Math.pow(v.x - cx, 2) + Math.pow(v.y - cy, 2));
  }
}

/**
 * Class representing a Circle
 * @extends {Shape}
 */
export class Circle extends Shape {
  /**
   * @param {Vec2} origin - Center point
   * @param {Number} radius - Radius of circle
   */
  constructor(origin, radius) {
    super(origin);
    this.radius = radius;
    this.path.arc(this.origin.x, this.origin.y, this.radius, 0, 2 * Math.PI);
  }
  /**
   *
   * @param {Vec2} v
   */
  outerDistance(v) {
    return this.origin.distance(v) - this.radius;
  }
}

export default {
  Shape,
  Circle,
  Rectangle,
};
