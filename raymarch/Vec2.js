/**
 * Class representing a 2D Vector
 */
export default class Vec2 {
  /**
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  /**
   * Get angle in degrees to another Vec2
   * @param {Vec2} v - Other Vec2
   * @returns {Number} - Angle in degrees
   */
  getDegTo(v) {
    return (this.getRadTo(v) * 180) / Math.PI;
  }

  /**
   * Get angle in radians to another Vec2
   * @param {Vec2} v - Other Vec2
   * @returns {Number} angle in radians
   */
  getRadTo(v) {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  /**
   *
   * @param {Vec2} v - Other Vec2 - nullable
   * @param {Number} angle - Angle in degrees
   * @param {Number} length - Length to extend by
   */
  getPointOnAngleDeg(v, angle, length) {
    angle = angle ?? this.getDegTo(v);
    angle = (angle / 180) * Math.PI;
    length = length || this.distance(v);
    const x = this.x + length * Math.cos(angle);
    const y = this.y + length * Math.sin(angle);
    return new Vec2(x, y);
  }

  /**
   * Get distance between two vectors
   * @param {Vec2} v
   * @returns {Number} distance
   */
  distance(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  /**
   * Adds v to this
   * @param {Vec2} v - Other Vec2
   * @returns {Vec2}
   */
  addVec(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtracts v from this
   * @param {Vec2} v - Other Vec2
   * @returns {Vec2}
   */
  subVec(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  /**
   * Divides this by num
   * @param {Number} num
   * @returns {Vec2}
   */
  divideNum(num) {
    return new Vec2(this.x / num, this.y / num);
  }

  /**
   * Multiplies this by num
   * @param {Number} num
   * @returns {Vec2}
   */
  multiplyNum(num) {
    return new Vec2(this.x * num, this.y * num);
  }

  /**
   * Normalizes this
   * @returns {Vec2}
   */
  normalize() {
    const length = this.length();
    const tmp = this.divideNum(length);
    return tmp;
  }

  /**
   * Extends this on the path of v by length
   * @param {Vec2} v
   * @param {Number} length
   * @returns {Vec2}
   */
  extend(v, length) {
    const tmp = v.subVec(this).normalize();
    return this.addVec(tmp.multiplyNum(length));
  }

  /**
   * Gets the length of this
   * @returns {Number}
   */
  length() {
    return Math.hypot(this.x, this.y);
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }
}
