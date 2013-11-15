(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['core', 'channel', 'manager', 'exports'], function(Caramal, Channel, MessageManager, exports) {
    var Chat;
    Chat = (function(_super) {
      __extends(Chat, _super);

      Chat.prototype.commands = ['open', 'join'];

      /**
       * 单一用户聊天
       * @param  {String} login  用户登陆名
       * @return {Chat}          Chat 对象
      */


      function Chat(login, options) {
        this.options = options;
        Chat.__super__.constructor.apply(this, arguments);
      }

      Chat.prototype.create = function(each_other, options) {
        var _base;
        return (_base = this.manager.channels)[each_other] || (_base[each_other] = new Chat(each_other, options));
      };

      return Chat;

    })(Channel);
    Caramal.MessageManager.registerDispatch('message', function(info, next) {
      var chat;
      switch (info.action) {
        case 'join':
          if (info.type === 1) {
            info.room;
            chat = Chat.create(info.from, {
              room: info.room
            });
            return chat.command('join');
          } else {
            return next();
          }
          break;
        default:
          return next();
      }
    });
    return exports.Chat = Chat;
  });

}).call(this);
