function Timer() {};
Timer.prototype = {
    started : false,
    stopped : false,
    startDate : null,
    stopDate : null,
    rate : 1000,
    refreshItems : []
};
Timer.prototype.start = function() {
    this.startDate = new Date();
    this.started = true;
    this.stopped = false;
    this.tictac();
};
Timer.prototype.stop = function() {
    this.stopDate = new Date();
    this.stopped = true;
    this.refresh();
};
Timer.prototype.reset = function() {
    this.startDate = null;
    this.stopDate = null;
    this.started = false;
    this.stopped = false;
};
Timer.prototype.interval = function() {
    var interval = 0;
    if (this.started) {
        var now = (this.stopped) ? this.stopDate : new Date();
        interval = Math.round((now - this.startDate)/1000);
    }
    return interval;
};
Timer.prototype.refresh = function() {
    for(var i = 0; i < this.refreshItems.length; i++) {
        this.refreshItems[i]();
    }
};
Timer.prototype.add = function(item) {
    if (typeof item == 'function') {
        var i = this.refreshItems.push(item);
        return i;
    } else {
        return null;
    }
};
Timer.prototype.tictac = function() {
    this.refresh();
    var self = this;
    if (this.started) {
        window.setTimeout(function() { self.tictac() }, self.rate);
    }
};