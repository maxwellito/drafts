class SpritePlayer {

  constructor (width, height) {
    this.createCanvas(width, height);
    this.browserFramerate = 1000/60;
    this.browserTimepoint = null;
    this.media = null;
    this.mediaIndex = 0;
    this.filters = [];

    this.iStart = 0;
    this.iDelay = 0;
    this.iEnd   = 0;
    this.input = 44;

    this.runnerBinded = this.frameRunner.bind(this);
  }

  setSprite (sprite) {
    this.media = sprite;
    this.mediaIndex = 0;
    this.mediaFramerate = 1000 / sprite.fps;
  }

  play (from = 0) {
    this.browserTimepoint = Date.now() - from;
    this.mediaIndex = -1;
    this.frameRunner();
  }

  pause () {
    cancelAnimationFrame(this.loop);
  }

  addFilter (filter) {}
  removeFilter () {}


  // Engine methods
  createCanvas (width, height) {
    var canvas = document.createElement('canvas');
    this.width  = canvas.width  = width;
    this.height = canvas.height = height;

    this.el  = canvas;
    this.ctx = canvas.getContext('2d');
  }

  showPicture (index) {
    if (this.mediaIndex === index) {
      return;
    }

    var fx = Math.floor(index % this.media.columns) * this.width,
        fy = Math.floor(index / this.media.columns) * this.height;

    this.ctx.clearRect(0, 0, this.width, this.height); // clear frame
    this.ctx.drawImage(this.media.data,
                       fx, fy, this.width, this.height,
                        0,  0, this.width, this.height);
    if (this.inputOn) this.delay();
    this.mediaIndex = index;
  }

  frameRunner () {
    var now = Date.now() - this.browserTimepoint;
    var frameIndex = Math.floor(now / this.mediaFramerate) % this.media.length;
    this.showPicture(frameIndex);
    this.loop = requestAnimationFrame(this.runnerBinded);
  }

  // Filters
  broken () {
    var cc = this.ctx.getImageData(0, 0, this.width, this.height),
      pStart = Math.round(421500 * this.iStart),
      pStartP = pStart - Math.round(1200 * this.iDelay),
      pEnd = pStart + Math.round(421500 * this.iEnd);

    cc.data.copyWithin(pStartP, pStart, pEnd)
    this.ctx.putImageData(cc,0,0)
  }

  delay () {
    var cc = this.ctx.getImageData(0, 0, this.width, this.height),
      originalData = this.ctx.getImageData(0, 0, this.width, this.height).data;

    var input = Math.max(0, Math.min(127, this.input));
    var v = [
      input / 2,
      input / 16,
      input / 4,
      input / 8
    ];

    var ax = v[input       % 4],
        ay = v[(input + 1) % 4],
        bx = v[(input + 2) % 4],
        by = v[(input + 3) % 4];

    ax = Math.floor(ax) * (ax % 1 > .5 ? 1 : -1);
    ay = Math.floor(ay) * (ay % 1 > .5 ? 1 : -1);
    bx = Math.floor(bx) * (bx % 1 > .5 ? 1 : -1);
    by = Math.floor(by) * (by % 1 > .5 ? 1 : -1);

    var x = 0,
        y = 0;

    var byteLength = cc.data.length;
    for (var i = 0; i < byteLength; i++) {
      if (i % 4 > 1) {
        continue;
      }
      x = Math.floor(i % (this.width * 4) / 4);
      y = Math.floor(i / (this.width * 4));
      if (i % 4 === 0) {
        cc.data[i] = originalData[((((x + ax) % this.width) + ((y + ay) % this.height) * this.width)) * 4];
      }
      else {
        cc.data[i] = originalData[((((x + bx) % this.width) + ((y + by) % this.height) * this.width)) * 4 + 1];
      }
    }
    this.ctx.putImageData(cc, 0, 0);
  }
}
