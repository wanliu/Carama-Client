(function() {
  define(['core', 'exports'], function(Caramal, exports) {
    var ClientMessageManager, Dispatchers;
    Dispatchers = (function() {
      function Dispatchers(name) {
        this.name = name;
        this.dispatch_queue = [];
      }

      Dispatchers.prototype.attach = function(dispatch) {
        return this.dispatch_queue.push(dispatch);
      };

      Dispatchers.prototype.process = function(msg) {
        var chunk_call, dispatch, _i, _len, _ref, _results;
        chunk_call = function(callback) {
          var do_next, next;
          do_next = false;
          next = function() {
            return do_next = true;
          };
          callback(msg, next);
          return do_next;
        };
        _ref = this.dispatch_queue;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dispatch = _ref[_i];
          if (!chunk_call(dispatch)) {
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return Dispatchers;

    })();
    ClientMessageManager = (function() {
      function ClientMessageManager(client) {
        this.client = client;
        this.message_dispatchs = {};
        this.return_commands = {};
        this.channels = {};
        if (this.client == null) {
          return;
        }
        this.bind();
      }

      ClientMessageManager.prototype.addReturnCommand = function(command) {
        if (!(command.option && (command.option.id != null))) {
          throw new Error('return command must have id property');
        }
        return this.return_commands[command.option.id] = command;
      };

      ClientMessageManager.prototype.bind = function() {
        var _this = this;
        this.unBind();
        this.client.on('message', function(data) {
          var e, info;
          try {
            info = JSON.parse(data);
            if (_this.isEventMessage(info)) {
              return _this.dispatch_process('event', info);
            } else {
              return _this.dispatch_process('command', info);
            }
          } catch (_error) {
            e = _error;
            return _this.onError(e);
          }
        });
        return this.client.on('chat', function(data) {
          return _this.dispatch_process('message', data);
        });
      };

      ClientMessageManager.prototype.dispatch_process = function(name, data) {
        var dispatch, e, info;
        dispatch = this.message_dispatchs[name];
        if (dispatch != null) {
          try {
            info = (function() {
              if (typeof data === 'string') {
                return JSON.parse(data);
              } else if (typeof data === 'object') {
                return data;
              } else {
                throw new Error('invalid data type');
              }
            })();
            return dispatch.process(info);
          } catch (_error) {
            e = _error;
            return this.onError(e);
          }
        }
      };

      ClientMessageManager.prototype.isEventMessage = function(info) {
        return info.action === 'notice';
      };

      ClientMessageManager.prototype.unBind = function() {
        if (this.client != null) {
          this.client.unsubscribe('message');
          return this.client.unsubscribe('chat');
        }
      };

      ClientMessageManager.prototype.setClient = function(client) {
        this.client = client;
        return this.bind();
      };

      ClientMessageManager.prototype.registerDispatch = function(message, dispatcher) {
        var dispatchers, _base;
        dispatchers = (_base = this.message_dispatchs)[message] || (_base[message] = new Dispatchers(message));
        return dispatchers.attach(dispatcher);
      };

      ClientMessageManager.prototype.onError = function(e) {
        return console.log(e);
      };

      ClientMessageManager.prototype.addChannel = function(id, channel) {
        return this.channels[id.toString()] = channel;
      };

      ClientMessageManager.prototype.addNamedChannel = function(name, channel) {
        return this.channels[name] = channel;
      };

      ClientMessageManager.prototype.ofChannel = function(id) {
        return this.channels[id.toString()];
      };

      ClientMessageManager.prototype.nameOfChannel = function(name) {
        return this.channels[name];
      };

      ClientMessageManager.prototype.roomOfChannel = function(room) {
        var chn, id, _ref;
        _ref = this.channels;
        for (id in _ref) {
          chn = _ref[id];
          if (chn.options && chn.options.room === room) {
            return chn;
          }
        }
        return null;
      };

      return ClientMessageManager;

    })();
    Caramal.MessageManager || (Caramal.MessageManager = new ClientMessageManager(window.client));
    return exports.ClientMessageManager = ClientMessageManager;
  });

}).call(this);
