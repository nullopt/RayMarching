import Vec2 from './Vec2.js';

export default class pathObj {
  /**
   *
   * @param {String} name
   * @param {Path2D} path
   * @param {Vec2} origin
   */
  constructor(name, path, origin) {
    this.name = name;
    this.path = path;
    this.origin = origin;
  }
}
