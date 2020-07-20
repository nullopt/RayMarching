import Vec2 from './Vec2.js';

export default class Ray {
  /**
   *
   * @param {Vec2} start
   * @param {Vec2} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  /**
   * @type {Number}
   */
  static MAX_LENGTH = 700;

  /**
   *
   * @param {Number} angle
   */
  getLine(angle) {
    const length = MAX_LENGTH;
  }
}
