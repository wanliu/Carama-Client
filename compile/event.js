(function() {
  define(['util'], function(Util) {
    var Event;
    return Event = (function() {
      function Event() {}

      Event.prototype._listeners = {};

      Event.prototype.addEventListener = function(event, callback) {
        var callbacks;
        if ((callbacks = this._listeners[event]) == null) {
          callbacks = this._listeners[event] = [];
        }
        if (Util.isArray(callbacks)) {
          return callbacks.push(callback);
        }
      };

      Event.prototype.removeEventListener = function(event, callback) {
        var callbacks, cb, i, _i, _len;
        callbacks = this._listeners[event];
        if ((callbacks != null) && Util.isArray(callbacks)) {
          for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
            cb = callbacks[i];
            if (Util.isFunc(cb) && callback === cb) {
              return callbacks.splice(i, 1)[0];
            }
          }
        }
      };

      Event.prototype.once = function(event, callback) {
        var cb, i, _i, _len;
        if ((typeof callbacks !== "undefined" && callbacks !== null) && Util.isArray(callbacks)) {
          for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
            cb = callbacks[i];
            if (Util.isFunc(cb) && callback === cb) {
              return;
            }
          }
          return this.on(event, callback);
        }
      };

      Event.prototype.on = function(event, callback) {
        return this.addEventListener(event, callback);
      };

      Event.prototype.emit = function(event, data) {
        var callback, callbacks, _i, _len, _results;
        callbacks = this._listeners[event] || [];
        _results = [];
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          if (Util.isFunc(callback)) {
            _results.push(callback(data));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Event.prototype.send = function(event, data) {};

      return Event;

    })();
  });

}).call(this);
