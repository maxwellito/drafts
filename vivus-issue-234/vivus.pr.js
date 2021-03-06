!(function () {
  'use strict';
  function e(t) {
    if (void 0 === t)
      throw new Error(
        'Pathformer [constructor]: "element" parameter is required'
      );
    if (t.constructor === String && !(t = document.getElementById(t)))
      throw new Error(
        'Pathformer [constructor]: "element" parameter is not related to an existing ID'
      );
    if (
      !(
        t instanceof window.SVGElement ||
        t instanceof window.SVGGElement ||
        /^svg$/i.test(t.nodeName)
      )
    )
      throw new Error(
        'Pathformer [constructor]: "element" parameter must be a string or a SVGelement'
      );
    (this.el = t), this.scan(t);
  }
  var r, n, t, l;
  function i(t, e, n) {
    r(),
      (this.isReady = !1),
      this.setElement(t, e),
      this.setOptions(e),
      this.setCallback(n),
      this.isReady && this.init();
  }
  (e.prototype.TYPES = [
    'line',
    'ellipse',
    'circle',
    'polygon',
    'polyline',
    'rect',
  ]),
    (e.prototype.ATTR_WATCH = [
      'cx',
      'cy',
      'points',
      'r',
      'rx',
      'ry',
      'x',
      'x1',
      'x2',
      'y',
      'y1',
      'y2',
    ]),
    (e.prototype.scan = function (t) {
      for (
        var e, n, r = t.querySelectorAll(this.TYPES.join(',')), i = 0;
        i < r.length;
        i++
      )
        (n = (0, this[(e = r[i]).tagName.toLowerCase() + 'ToPath'])(
          this.parseAttr(e.attributes)
        )),
          (n = this.pathMaker(e, n)),
          e.parentNode.replaceChild(n, e);
    }),
    (e.prototype.lineToPath = function (t) {
      var e = {},
        n = t.x1 || 0,
        r = t.y1 || 0,
        i = t.x2 || 0,
        t = t.y2 || 0;
      return (e.d = 'M' + n + ',' + r + 'L' + i + ',' + t), e;
    }),
    (e.prototype.rectToPath = function (t) {
      var e,
        n = {},
        r = parseFloat(t.x) || 0,
        i = parseFloat(t.y) || 0,
        a = parseFloat(t.width) || 0,
        o = parseFloat(t.height) || 0;
      return (
        t.rx || t.ry
          ? ((e = parseInt(t.rx, 10) || -1),
            (t = parseInt(t.ry, 10) || -1),
            (e = Math.min(Math.max(e < 0 ? t : e, 0), a / 2)),
            (t = Math.min(Math.max(t < 0 ? e : t, 0), o / 2)),
            (n.d =
              'M ' +
              (r + e) +
              ',' +
              i +
              ' L ' +
              (r + a - e) +
              ',' +
              i +
              ' A ' +
              e +
              ',' +
              t +
              ',0,0,1,' +
              (r + a) +
              ',' +
              (i + t) +
              ' L ' +
              (r + a) +
              ',' +
              (i + o - t) +
              ' A ' +
              e +
              ',' +
              t +
              ',0,0,1,' +
              (r + a - e) +
              ',' +
              (i + o) +
              ' L ' +
              (r + e) +
              ',' +
              (i + o) +
              ' A ' +
              e +
              ',' +
              t +
              ',0,0,1,' +
              r +
              ',' +
              (i + o - t) +
              ' L ' +
              r +
              ',' +
              (i + t) +
              ' A ' +
              e +
              ',' +
              t +
              ',0,0,1,' +
              (r + e) +
              ',' +
              i))
          : (n.d =
              'M' +
              r +
              ' ' +
              i +
              ' L' +
              (r + a) +
              ' ' +
              i +
              ' L' +
              (r + a) +
              ' ' +
              (i + o) +
              ' L' +
              r +
              ' ' +
              (i + o) +
              ' Z'),
        n
      );
    }),
    (e.prototype.polylineToPath = function (t) {
      var e,
        n = {},
        r = t.points.trim().split(' ');
      if (-1 === t.points.indexOf(',')) {
        for (var i = [], a = 0; a < r.length; a += 2)
          i.push(r[a] + ',' + r[a + 1]);
        r = i;
      }
      for (e = 'M' + r[0], a = 1; a < r.length; a++)
        -1 !== r[a].indexOf(',') && (e += 'L' + r[a]);
      return (n.d = e), n;
    }),
    (e.prototype.polygonToPath = function (t) {
      t = e.prototype.polylineToPath(t);
      return (t.d += 'Z'), t;
    }),
    (e.prototype.ellipseToPath = function (t) {
      var e = {},
        n = parseFloat(t.rx) || 0,
        r = parseFloat(t.ry) || 0,
        i = parseFloat(t.cx) || 0,
        a = parseFloat(t.cy) || 0,
        o = i - n,
        t = a,
        i = parseFloat(i) + parseFloat(n);
      return (
        (e.d =
          'M' +
          o +
          ',' +
          t +
          'A' +
          n +
          ',' +
          r +
          ' 0,1,1 ' +
          i +
          ',' +
          a +
          'A' +
          n +
          ',' +
          r +
          ' 0,1,1 ' +
          o +
          ',' +
          a),
        e
      );
    }),
    (e.prototype.circleToPath = function (t) {
      var e = {},
        n = parseFloat(t.r) || 0,
        r = parseFloat(t.cx) || 0,
        i = parseFloat(t.cy) || 0,
        a = r - n,
        t = i,
        r = parseFloat(r) + parseFloat(n);
      return (
        (e.d =
          'M' +
          a +
          ',' +
          t +
          'A' +
          n +
          ',' +
          n +
          ' 0,1,1 ' +
          r +
          ',' +
          i +
          'A' +
          n +
          ',' +
          n +
          ' 0,1,1 ' +
          a +
          ',' +
          i),
        e
      );
    }),
    (e.prototype.pathMaker = function (t, e) {
      for (
        var n,
          r = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
          i = 0;
        i < t.attributes.length;
        i++
      )
        (n = t.attributes[i]),
          -1 === this.ATTR_WATCH.indexOf(n.name) &&
            r.setAttribute(n.name, n.value);
      for (i in e) r.setAttribute(i, e[i]);
      return r;
    }),
    (e.prototype.parseAttr = function (t) {
      for (var e, n = {}, r = 0; r < t.length; r++) {
        if (
          ((e = t[r]),
          -1 !== this.ATTR_WATCH.indexOf(e.name) && -1 !== e.value.indexOf('%'))
        )
          throw new Error(
            "Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into 'path' tags. Please use 'viewBox'."
          );
        n[e.name] = e.value;
      }
      return n;
    }),
    (i.LINEAR = function (t) {
      return t;
    }),
    (i.EASE = function (t) {
      return -Math.cos(t * Math.PI) / 2 + 0.5;
    }),
    (i.EASE_OUT = function (t) {
      return 1 - Math.pow(1 - t, 3);
    }),
    (i.EASE_IN = function (t) {
      return Math.pow(t, 3);
    }),
    (i.EASE_OUT_BOUNCE = function (t) {
      var e = 1 - Math.cos(t * (0.5 * Math.PI)),
        e = Math.pow(e, 1.5),
        t = Math.pow(1 - t, 2);
      return 1 - t + (1 - Math.abs(Math.cos(e * (2.5 * Math.PI)))) * t;
    }),
    (i.prototype.setElement = function (e, n) {
      if (void 0 === e)
        throw new Error('Vivus [constructor]: "element" parameter is required');
      if (e.constructor === String && !(e = document.getElementById(e)))
        throw new Error(
          'Vivus [constructor]: "element" parameter is not related to an existing ID'
        );
      if (((this.parentEl = e), n && n.file)) {
        var r = this,
          t = function () {
            var t = document.createElement('div');
            t.innerHTML = this.responseText;
            t = t.querySelector('svg');
            if (!t)
              throw new Error(
                'Vivus [load]: Cannot find the SVG in the loaded file : ' +
                  n.file
              );
            (r.el = t),
              r.el.setAttribute('width', '100%'),
              r.el.setAttribute('height', '100%'),
              r.parentEl.appendChild(r.el),
              (r.isReady = !0),
              r.init(),
              (r = null);
          },
          i = new window.XMLHttpRequest();
        return (
          i.addEventListener('load', t), i.open('GET', n.file), void i.send()
        );
      }
      switch (e.constructor) {
        case window.SVGSVGElement:
        case window.SVGElement:
        case window.SVGGElement:
          (this.el = e), (this.isReady = !0);
          break;
        case window.HTMLObjectElement:
          (r = this),
            (t = function (t) {
              if (!r.isReady) {
                if (
                  ((r.el =
                    e.contentDocument &&
                    e.contentDocument.querySelector('svg')),
                  !r.el && t)
                )
                  throw new Error(
                    'Vivus [constructor]: object loaded does not contain any SVG'
                  );
                r.el &&
                  (e.getAttribute('built-by-vivus') &&
                    (r.parentEl.insertBefore(r.el, e),
                    r.parentEl.removeChild(e),
                    r.el.setAttribute('width', '100%'),
                    r.el.setAttribute('height', '100%')),
                  (r.isReady = !0),
                  r.init(),
                  (r = null));
              }
            })() || e.addEventListener('load', t);
          break;
        default:
          throw new Error(
            'Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)'
          );
      }
    }),
    (i.prototype.setOptions = function (t) {
      var e = [
          'delayed',
          'sync',
          'async',
          'nsync',
          'oneByOne',
          'scenario',
          'scenario-sync',
        ],
        n = ['inViewport', 'manual', 'autostart'];
      if (void 0 !== t && t.constructor !== Object)
        throw new Error(
          'Vivus [constructor]: "options" parameter must be an object'
        );
      if ((t = t || {}).type && -1 === e.indexOf(t.type))
        throw new Error(
          'Vivus [constructor]: ' +
            t.type +
            ' is not an existing animation `type`'
        );
      if (((this.type = t.type || e[0]), t.start && -1 === n.indexOf(t.start)))
        throw new Error(
          'Vivus [constructor]: ' +
            t.start +
            ' is not an existing `start` option'
        );
      if (
        ((this.start = t.start || n[0]),
        (this.isIE =
          -1 !== window.navigator.userAgent.indexOf('MSIE') ||
          -1 !== window.navigator.userAgent.indexOf('Trident/') ||
          -1 !== window.navigator.userAgent.indexOf('Edge/')),
        (this.duration = l(t.duration, 120)),
        (this.delay = l(t.delay, null)),
        (this.dashGap = l(t.dashGap, 1)),
        (this.forceRender = t.hasOwnProperty('forceRender')
          ? !!t.forceRender
          : this.isIE),
        (this.reverseStack = !!t.reverseStack),
        (this.selfDestroy = !!t.selfDestroy),
        (this.onReady = t.onReady),
        (this.map = []),
        (this.frameLength = this.currentFrame = this.delayUnit = this.speed = this.handle = null),
        (this.ignoreInvisible =
          !!t.hasOwnProperty('ignoreInvisible') && !!t.ignoreInvisible),
        (this.animTimingFunction = t.animTimingFunction || i.LINEAR),
        (this.pathTimingFunction = t.pathTimingFunction || i.LINEAR),
        this.delay >= this.duration)
      )
        throw new Error(
          'Vivus [constructor]: delay must be shorter than duration'
        );
    }),
    (i.prototype.setCallback = function (t) {
      if (t && t.constructor !== Function)
        throw new Error(
          'Vivus [constructor]: "callback" parameter must be a function'
        );
      this.callback = t || function () {};
    }),
    (i.prototype.mapping = function () {
      for (
        var t,
          e,
          n,
          r,
          i,
          a,
          o = (r = i = 0),
          s = this.el.querySelectorAll('path'),
          h = 0;
        h < s.length;
        h++
      )
        (t = s[h]),
          this.isInvisible(t) ||
            ((a =
              'non-scaling-stroke' === t.getAttribute('vector-effect')
                ? t.getBoundingClientRect().width / t.getBBox().width
                : 1),
            (n = { el: t, length: Math.ceil(t.getTotalLength() * a) }),
            isNaN(n.length)
              ? window.console &&
                console.warn &&
                console.warn(
                  'Vivus [mapping]: cannot retrieve a path element length',
                  t
                )
              : (this.map.push(n),
                (t.style.strokeDasharray =
                  n.length + ' ' + (n.length + 2 * this.dashGap)),
                (t.style.strokeDashoffset = n.length + this.dashGap),
                (n.length += this.dashGap),
                (r += n.length),
                this.renderPath(h)));
      for (
        r = 0 === r ? 1 : r,
          this.delay = null === this.delay ? this.duration / 3 : this.delay,
          this.delayUnit = this.delay / (1 < s.length ? s.length - 1 : 1),
          this.reverseStack && this.map.reverse(),
          h = 0;
        h < this.map.length;
        h++
      ) {
        switch (((n = this.map[h]), this.type)) {
          case 'delayed':
            (n.startAt = this.delayUnit * h),
              (n.duration = this.duration - this.delay);
            break;
          case 'oneByOne':
            (n.startAt = (i / r) * this.duration),
              (n.duration = (n.length / r) * this.duration);
            break;
          case 'sync':
          case 'async':
          case 'nsync':
            (n.startAt = 0), (n.duration = this.duration);
            break;
          case 'scenario-sync':
            (t = n.el),
              (e = this.parseAttr(t)),
              (n.startAt = o + (l(e['data-delay'], this.delayUnit) || 0)),
              (n.duration = l(e['data-duration'], this.duration)),
              (o =
                void 0 !== e['data-async']
                  ? n.startAt
                  : n.startAt + n.duration),
              (this.frameLength = Math.max(
                this.frameLength,
                n.startAt + n.duration
              ));
            break;
          case 'scenario':
            (t = n.el),
              (e = this.parseAttr(t)),
              (n.startAt = l(e['data-start'], this.delayUnit) || 0),
              (n.duration = l(e['data-duration'], this.duration)),
              (this.frameLength = Math.max(
                this.frameLength,
                n.startAt + n.duration
              ));
        }
        (i += n.length), (this.frameLength = this.frameLength || this.duration);
      }
    }),
    (i.prototype.drawer = function () {
      var t = this;
      if (((this.currentFrame += this.speed), this.currentFrame <= 0))
        this.stop(), this.reset();
      else {
        if (!(this.currentFrame >= this.frameLength))
          return (
            this.trace(),
            void (this.handle = n(function () {
              t.drawer();
            }))
          );
        this.stop(),
          (this.currentFrame = this.frameLength),
          this.trace(),
          this.selfDestroy && this.destroy();
      }
      this.callback(this),
        this.instanceCallback &&
          (this.instanceCallback(this), (this.instanceCallback = null));
    }),
    (i.prototype.trace = function () {
      for (
        var t,
          e,
          n =
            this.animTimingFunction(this.currentFrame / this.frameLength) *
            this.frameLength,
          r = 0;
        r < this.map.length;
        r++
      )
        (t = (n - (e = this.map[r]).startAt) / e.duration),
          (t = this.pathTimingFunction(Math.max(0, Math.min(1, t)))),
          e.progress !== t &&
            ((e.progress = t),
            (e.el.style.strokeDashoffset = Math.floor(e.length * (1 - t))),
            this.renderPath(r));
    }),
    (i.prototype.renderPath = function (t) {
      var e;
      this.forceRender &&
        this.map &&
        this.map[t] &&
        ((t = (e = this.map[t]).el.cloneNode(!0)),
        e.el.parentNode.replaceChild(t, e.el),
        (e.el = t));
    }),
    (i.prototype.init = function () {
      (this.frameLength = 0),
        (this.currentFrame = 0),
        (this.map = []),
        new e(this.el),
        this.mapping(),
        this.starter(),
        this.onReady && this.onReady(this);
    }),
    (i.prototype.starter = function () {
      switch (this.start) {
        case 'manual':
          return;
        case 'autostart':
          this.play();
          break;
        case 'inViewport':
          var t = this,
            e = function () {
              t.isInViewport(t.parentEl, 1) &&
                (t.play(), window.removeEventListener('scroll', e));
            };
          window.addEventListener('scroll', e), e();
      }
    }),
    (i.prototype.getStatus = function () {
      return 0 === this.currentFrame
        ? 'start'
        : this.currentFrame === this.frameLength
        ? 'end'
        : 'progress';
    }),
    (i.prototype.reset = function () {
      return this.setFrameProgress(0);
    }),
    (i.prototype.finish = function () {
      return this.setFrameProgress(1);
    }),
    (i.prototype.setFrameProgress = function (t) {
      return (
        (t = Math.min(1, Math.max(0, t))),
        (this.currentFrame = Math.round(this.frameLength * t)),
        this.trace(),
        this
      );
    }),
    (i.prototype.play = function (t, e) {
      if (((this.instanceCallback = null), t && 'function' == typeof t))
        (this.instanceCallback = t), (t = null);
      else if (t && 'number' != typeof t)
        throw new Error('Vivus [play]: invalid speed');
      return (
        e &&
          'function' == typeof e &&
          !this.instanceCallback &&
          (this.instanceCallback = e),
        (this.speed = t || 1),
        this.handle || this.drawer(),
        this
      );
    }),
    (i.prototype.stop = function () {
      return this.handle && (t(this.handle), (this.handle = null)), this;
    }),
    (i.prototype.destroy = function () {
      var t, e;
      for (this.stop(), t = 0; t < this.map.length; t++)
        ((e = this.map[t]).el.style.strokeDashoffset = null),
          (e.el.style.strokeDasharray = null),
          this.renderPath(t);
    }),
    (i.prototype.isInvisible = function (t) {
      var e = t.getAttribute('data-ignore');
      return null !== e
        ? 'false' !== e
        : !!this.ignoreInvisible &&
            !(t = t.getBoundingClientRect()).width &&
            !t.height;
    }),
    (i.prototype.parseAttr = function (t) {
      var e,
        n = {};
      if (t && t.attributes)
        for (var r = 0; r < t.attributes.length; r++)
          n[(e = t.attributes[r]).name] = e.value;
      return n;
    }),
    (i.prototype.isInViewport = function (t, e) {
      var n = this.scrollY(),
        r = n + this.getViewportH(),
        i = t.getBoundingClientRect(),
        t = i.height,
        i = n + i.top;
      return i + t * (e = e || 0) <= r && n <= i + t;
    }),
    (i.prototype.getViewportH = function () {
      var t = this.docElem.clientHeight,
        e = window.innerHeight;
      return t < e ? e : t;
    }),
    (i.prototype.scrollY = function () {
      return window.pageYOffset || this.docElem.scrollTop;
    }),
    (r = function () {
      i.prototype.docElem ||
        ((i.prototype.docElem = window.document.documentElement),
        (n =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (t) {
            return window.setTimeout(t, 1e3 / 60);
          }),
        (t =
          window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.msCancelAnimationFrame ||
          function (t) {
            return window.clearTimeout(t);
          }));
    }),
    (l = function (t, e) {
      t = parseInt(t, 10);
      return 0 <= t ? t : e;
    }),
    'function' == typeof define && define.amd
      ? define([], function () {
          return i;
        })
      : 'object' == typeof exports
      ? (module.exports = i)
      : (window.Vivus = i);
})();
