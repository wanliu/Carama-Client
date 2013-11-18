(function() {
  var __slice = [].slice;

  define(['exports'], function(exports) {
    exports.Caramal = {};
    exports.Caramal.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (exports.Caramal.debug != null) {
        return console.log.apply(this, args);
      }
    };
    return exports.Caramal;
  });

}).call(this);
