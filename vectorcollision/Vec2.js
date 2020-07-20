export default class Vec2 {
  constructor(x, y, radius) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.radius = radius ?? 0;
  }

  /**
   *
   * @param {Vec2} v
   * @returns {Number}
   */
  distance(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  /**
   *
   * @param {Vec2} v
   * @returns {Number}
   */
  outerDistance(v) {
    return this.distance(v) - v.radius;
  }

  /**
   *
   * @param {Vec2} v
   * @returns {Number} angle in degrees
   */
  getDegTo(v) {
    return (this.getRadTo(v) * 180) / Math.PI;
  }

  /**
   *
   * @param {Vec2} v
   * @returns {Number} angle in radians
   */
  getRadTo(v) {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  getPointOnAngleDeg(v, angle, length) {
    angle = angle ?? this.getDegTo(v);
    angle = (angle / 180) * Math.PI;
    length = length || this.distance(v);
    const x = this.x + length * Math.cos(angle);
    const y = this.y + length * Math.sin(angle);
    return {
      pos: new Vec2(x, y),
      angle: (angle * 180) / Math.PI,
    };
  }

  getPointOnAngleRad(v, length) {
    angle = angle ?? this.getRadTo(v);
    length = length || this.distance(v);
    const x = this.x + length * Math.cos(angle);
    const y = this.y + length * Math.sin(angle);
    return {
      pos: new Vec2(x, y),
      angle: angle,
    };
  }

  /**
   *
   * @param {Vec2} v
   * @returns {Boolean} bool: is in area
   */
  isInArea(v) {
    const distPoints = (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
    const r = this.radius * this.radius;

    return distPoints < r;
  }
}

/**
 *
 * @param {Number} x
 * @param {Number} y
 */
const getDif = (x, y) => {
  return x > y ? x - y : y - x;
};
