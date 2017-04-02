const Native = require('canvas');

class Canvas {
  constructor(w, h) {
    this.canvas = new Native(w, h);
    this.ctx = this.canvas.getContext('2d');
  }

  text(x, y, str, options = {}) {
    this.applyOptions(options);
    this.ctx.fillText(str, x, y);
    return this;
  }

  rect(x0, y0, x1, y1, options) {
    this.applyOptions(options);
    this.ctx.fillRect(x0, y0, x1, y1);
    return this;
  }

  path(path, fill = true, options) {
    this.applyOptions(options);
    this.ctx.beginPath();
    const start = path.shift();
    this.ctx.moveTo(start[0], start[1]);
    for (const [x, y] of path) this.ctx.lineTo(x, y);
    if (fill) this.ctx.fill();
    return this;
  }

  export(type, sync = true, ...extra) {
    const map = {
      url: (...x) => this.canvas.toDataURL(...x),
      buffer: (...x) => this.canvas.toBuffer(...x),
      base64: (...x) => map.buffer(...x).toString('base64'),
    };
    if (!(type in map)) type = 'buffer';
    const fn = map[type];
    if (sync) {
      return fn(...extra);
    } else {
      return new Promise((resolve, reject) => {
        fn(...extra, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    }
  }

  applyOptions(options = {}) {
    if (options.fill) this.ctx.fillStyle = options.fill;
    if (options.stroke) this.ctx.strokeStyle = options.stroke;
    if (options.miterLimit) this.ctx.miterLimit = options.miterLimit;
    if (options.line) {
      const line = options.line;
      if (line.width) this.ctx.lineWidth = line.width;
      if (line.join) this.ctx.lineJoin = line.join;
      if (line.dashOffset) this.ctx.lineDashOffset = line.dashOffset;
      if (line.cap) this.ctx.lineCap = line.cap;
    }
  }
}

console.log(new Canvas(100, 100).text(5, 5, 'hello').export('base64'));

module.exports = Canvas;
