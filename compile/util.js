(function() {
  define(['exports'], function(exports) {
    exports.isFunc = function(object) {
      return typeof object === 'function';
    };
    exports.isObject = function(obj) {
      var key, _i, _len;
      if (!obj || obj.toString() !== "[object Object]" || obj.nodeType || obj.setInterval) {
        return false;
      }
      if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
        return false;
      }
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        key = obj[_i];      }
      return key === void 0 || obj.hasOwnProperty(key);
    };
    exports.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
    exports.generateId = function() {
      return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString() + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
    };
    exports.merge = function(target, other) {
      var k, value;
      for (k in other) {
        value = other[k];
        if (exports.isObject(value)) {
          target[v] = {};
          target[v] = exports.merge(target[v], value);
        } else {
          target[k] = value;
        }
      }
      return target;
    };
    exports.classify = function(klass_string) {};
    String.prototype.toTitleCase = function() {
      return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
    Array.prototype.contain = function(member) {
      var e, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        e = this[_i];
        if (e === member) {
          return true;
        }
      }
      return false;
    };
    return exports;
  });

}).call(this);
