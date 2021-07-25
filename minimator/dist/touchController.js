/**
 * The touch Controller will handle the touch events
 * on the main canvas to handle the basic gestures
 * of a graphical editor on a tablet or desktop.
 *
 * Things to handle:
 * - one finger
 *     tap: nothing
 *     move: draw
 * - double fingers
 *     tap: undo
 *     move: scale
 * - three fingers
 *     tap: redo
 *     move: nothing
 * - more fingers
 *     please zoidberg stop licking that screen
 */
// 100ms is the max time to start/end a gesture
const gestureTransitionTime = 100;
export var GESTURE;
(function (GESTURE) {
    GESTURE[GESTURE["NONE"] = 0] = "NONE";
    GESTURE[GESTURE["TAP"] = 1] = "TAP";
    GESTURE[GESTURE["DRAG"] = 2] = "DRAG";
    GESTURE[GESTURE["UNDO"] = 3] = "UNDO";
    GESTURE[GESTURE["SCALE"] = 4] = "SCALE";
    GESTURE[GESTURE["REDO"] = 5] = "REDO";
    GESTURE[GESTURE["VOID"] = 6] = "VOID";
})(GESTURE || (GESTURE = {}));
export var STATE;
(function (STATE) {
    STATE[STATE["START"] = 0] = "START";
    STATE[STATE["UPDATE"] = 1] = "UPDATE";
    STATE[STATE["END"] = 2] = "END";
    STATE[STATE["NONE"] = 3] = "NONE";
})(STATE || (STATE = {}));
export class TouchController {
    el;
    pointers;
    callbacks;
    lastData;
    currentEvent;
    gestureMaxTouches = 0;
    currentGestureHasMoved = false; //# This property isn't in use
    constructor(element) {
        // Save the element
        this.el = element;
        // Internals
        this.pointers = new Map();
        this.callbacks = [];
        // this.hasDigestPlanned = null;
        this.currentEvent = GESTURE.NONE;
        // Bind listeners
        this.touchstart = this.touchstart.bind(this);
        this.touchmove = this.touchmove.bind(this);
        this.touchend = this.touchend.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mousedown = this.mousedown.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.mousescroll = this.mousescroll.bind(this);
        // this.eventRouterDigest = this.eventRouterDigest.bind(this);
        // Start listening touch events
        this.el.addEventListener('touchstart', this.touchstart);
        this.el.addEventListener('touchmove', this.touchmove);
        this.el.addEventListener('touchend', this.touchend);
        this.el.addEventListener('touchcancel', this.touchend);
        // Start listening mouse events
        this.el.addEventListener('mousemove', this.mousemove);
        this.el.addEventListener('mousedown', this.mousedown);
        this.el.addEventListener('mouseup', this.mouseup);
        this.el.addEventListener('wheel', this.mousescroll);
    }
    on(callback) {
        this.callbacks.push(callback);
    }
    off(callback) {
        const cbIndex = this.callbacks.indexOf(callback);
        if (cbIndex !== -1) {
            this.callbacks.splice(cbIndex, 1);
        }
    }
    blockEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    /**
     * Touch events
     */
    touchstart(e) {
        this.blockEvent(e);
        // console.log(e);
        if (this.isCurrentEventDetected()) {
            return;
        }
        for (let i = e.changedTouches.length - 1; i >= 0; i--) {
            let touch = e.changedTouches.item(i);
            this.pointers.set(touch?.identifier || 0, touch);
        }
        this.gestureMaxTouches = e.touches.length;
    }
    touchmove(e) {
        this.blockEvent(e);
        if (this.isCurrentEventDetected()) {
            this.updateCurrentEvent(e);
            return;
        }
        for (let i = e.changedTouches.length - 1; i >= 0; i--) {
            let touch = e.changedTouches.item(i);
            if (!touch) {
                console.warn('Missed touch');
                continue;
            }
            let pointer = this.pointers.get(touch.identifier);
            let x = Math.abs(touch.clientX - pointer.clientX);
            let y = Math.abs(touch.clientY - pointer.clientY);
            if (x + y > 20) {
                let { length } = e.touches;
                this.currentGestureHasMoved = true;
                const defaultData = {
                    origin: {
                        x: 0,
                        y: 0,
                    },
                    drag: {
                        x: 0,
                        y: 0,
                    },
                };
                this.pointers.forEach((p) => {
                    defaultData.origin.x += p.clientX;
                    defaultData.origin.y += p.clientY;
                });
                defaultData.origin.x /= this.pointers.size;
                defaultData.origin.y /= this.pointers.size;
                if (length === 1) {
                    this.setEventType(GESTURE.DRAG, defaultData);
                }
                else if (length === 2) {
                    this.setEventType(GESTURE.SCALE, defaultData);
                }
                else {
                    this.setEventType(GESTURE.VOID);
                }
            }
        }
    }
    touchend(e) {
        this.blockEvent(e);
        for (let i = e.changedTouches.length - 1; i >= 0; i--) {
            let touch = e.changedTouches.item(i);
            if (!touch) {
                console.warn('Missed touch');
                continue;
            }
            this.pointers.delete(touch.identifier);
        }
        if (e.touches.length === 0) {
            if (!this.currentEvent /* || this.currentEvent === GESTURE.NONE */) {
                if (this.gestureMaxTouches === 1) {
                    this.setEventType(GESTURE.TAP);
                }
                else if (this.gestureMaxTouches === 2) {
                    this.setEventType(GESTURE.UNDO);
                }
                else {
                    this.setEventType(GESTURE.REDO);
                }
            }
            this.setEventType(GESTURE.NONE);
            this.currentGestureHasMoved = true;
            this.gestureMaxTouches = 0;
            // TODO clear everything
        }
    }
    /*
     * Mouse events
     */
    mousedown(e) { }
    mousemove(e) { }
    mouseup(e) { }
    mousescroll(e) {
        e.preventDefault();
        const defaultData = {
            origin: {
                x: e.pageX,
                y: e.pageY,
            },
            drag: {
                x: 0,
                y: 0,
            },
            scale: 1,
        };
        this.setEventType(GESTURE.SCALE, defaultData);
        this.triggerUpdate({
            origin: {
                x: e.pageX,
                y: e.pageY,
            },
            drag: {
                x: 0,
                y: 0,
            },
            scale: Math.pow(1.01, -e.deltaY),
        });
        console.log(e.pageX, e.pageY);
    }
    isCurrentEventDetected() {
        return this.currentEvent !== GESTURE.NONE;
    }
    updateCurrentEvent(e) {
        switch (this.currentEvent) {
            case GESTURE.DRAG:
                const b = e.touches.item(0);
                if (!b) {
                    return;
                }
                const a = this.pointers.get(b.identifier);
                this.triggerUpdate({
                    origin: {
                        x: a.clientX,
                        y: a.clientY,
                    },
                    drag: {
                        x: b.clientX - a.clientX,
                        y: b.clientY - a.clientY,
                    },
                });
                console.log(a.clientX, a.clientY);
                break;
            case GESTURE.SCALE:
                const b1 = e.touches.item(0);
                const b2 = e.touches.item(1);
                if (!b1 || !b2) {
                    return;
                }
                const a1 = this.pointers.get(b1.identifier);
                const a2 = this.pointers.get(b2.identifier);
                this.triggerUpdate({
                    origin: {
                        x: (a1.clientX + a2.clientX) / 2,
                        y: (a1.clientY + a2.clientY) / 2,
                    },
                    drag: {
                        x: (b1.clientX + b2.clientX) / 2 - (a1.clientX + a2.clientX) / 2,
                        y: (b1.clientY + b2.clientY) / 2 - (a1.clientY + a2.clientY) / 2,
                    },
                    scale: (Math.abs(b1.clientX - b2.clientX) +
                        Math.abs(b1.clientY - b2.clientY)) /
                        (Math.abs(a1.clientX - a2.clientX) +
                            Math.abs(a1.clientY - a2.clientY)),
                });
                break;
        }
    }
    setEventType(eventType, eventData) {
        this.broadcast(STATE.END, this.lastData);
        this.currentEvent = eventType;
        this.lastData = undefined;
        this.broadcast(STATE.START, eventData);
    }
    triggerUpdate(data) {
        this.broadcast(STATE.UPDATE, data);
    }
    broadcast(eventStatus, eventData) {
        const type = this.currentEvent;
        if (type === GESTURE.NONE || type === GESTURE.VOID) {
            return;
        }
        this.lastData = eventData;
        this.callbacks.forEach((cb) => cb(type, eventStatus, eventData));
    }
    cancel() {
        // Stop listening
        this.el.removeEventListener('touchstart', this.touchstart);
        this.el.removeEventListener('touchmove', this.touchmove);
        this.el.removeEventListener('touchend', this.touchend);
        this.el.removeEventListener('touchcancel', this.touchend);
    }
}
