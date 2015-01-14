var Timer = function Timer(callback, opts) {
    this._callback = callback;
    this._opts = opts;

    this._timer = null;
};

Timer.prototype.start = function start() {
    this._callback().finally(this._scheduleCall.bind(this));
};

Timer.prototype.stop = function stop() {
    if (this._timer) {
        clearTimeout(this._timer);
    }

    this._timer = null;
};

Timer.prototype._scheduleCall = function _scheduleCall() {
    this._timer = setTimeout(this.start.bind(this), this._opts.interval);
};

module.exports = Timer;
