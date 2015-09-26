function createInterval(callback, opts) {
    var _timer;

    function start() {
        callback().finally(_scheduleCall);
    }

    function stop() {
        if (_timer) {
            clearTimeout(_timer);
        }

        _timer = null;
    }

    function _scheduleCall() {
        if (_timer === null) {
            // Do not schedule call if interval has been stopped
            return;
        }

        _timer = setTimeout(start, opts.interval);
    };

    return {
        start,
        stop
    };
}

export default createInterval;
