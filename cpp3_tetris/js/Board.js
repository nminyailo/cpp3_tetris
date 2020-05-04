class Board {
  constructor(x, y) {
    this.xcells = x;
    this.ycells = y;
    this.cells = new Array(x).fill(null).map(row => new Array(y));
  }

  get x() {
    return this.xcells;
  }

  get y() {
    return this.ycells;
  }

  get val() {
    return this.cells;
  }

  set x(v) {
    this.xcells = v;
  }

  set y(v) {
    this.ycells = v;
  }

  set val(v) {
    this.cells = v;
  }

  add(s) {
    const d = s.Shape[s.Rotation];
    for (let i = 0; i < 4; i++)
      this.val[s.x + d[i][0]][s.y + d[i][1]] = s.Color;
  }

  /**
   *
   * @param {function} viewCb view.update()
   * @param {function} statusCb status.lines++; status.checkLevel()
   */
  checkLines(viewCb, statusCb) {
    for (let i = 1; i < this.y; i++)
      if (this.checkLine(i, statusCb)) this.scroll(i);
    viewCb();
  }

  checkLine(l, cb) {
    for (let i = 0; i < this.x; i++) if (!this.val[i][l]) return false;
    cb();
    return true;
  }

  scroll = function(l) {
    while (--l)
      for (let i = 0; i < this.x; i++) this.val[i][l + 1] = this.val[i][l];
  };
}
