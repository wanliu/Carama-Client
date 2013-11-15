(function() {
  define(['exports'], function(exports) {
    var String;
    exports.isFunc = function(object) {
      return typeof object === 'function';
    };
    exports.isObject = function(object) {
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
    exports.generateId = function() {
      Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
      return +Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
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
    exports.contain = function(list, member) {
      var e, _i, _len;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        e = list[_i];
        if (e === memeber) {
          return true;
        }
      }
      return false;
    };
    exports.classify = function(klass_string) {};
    return String = (function() {
      function String() {}

      String.prototype.toTitleCase = function() {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };

      return String;

    })();
  });

}).call(this);
