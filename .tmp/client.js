(function() {
  define(['socket.io', 'core'], function(io, Caramal) {
    Caramal.Client = (function() {
      function Client(url, options) {
        this.url = url;
        this.options = options;
        this.socket = io.connect(this.url, this.options);
      }

      Client.prototype.on = function(event, callback) {
        return this.socket.on(event, callback);
      };

      Client.prototype.subscribe = function(channel, callback) {
        return this.on(channel, callback);
      };

      Client.prototype.unsubscribe = function(channel, callback) {
        return this.socket.removeListener(channel);
      };

      Client.prototype.emit = function(event, data, callback) {
        return this.socket.emit(event, data, callback);
      };

      return Client;

    })();
    return Caramal.connect = function(url, options) {
      return new Caramal.Client(url, options);
    };
  });

}).call(this);
