var Chat = require('./chat').Chat,
    EventEmitter = require('events').EventEmitter,
    util = require('util');

var Client = function(){
    this.socket;
};

Client.chats = {};
Client.groups = {};

/**
 * openChat 打开一对一对话对象
 * @param  {hash}   user_opts   hash 结构
 * @param  {Function} callback  成功的回调方法
 * @param  {Function}   error     失败的回调方法
 * @return {Chat}               返回一个对话类对象
 */
Client.prototype.openChat = function (user_opts, callback, error) {
    var name = user_opts.name;
    var options = {};
    return this.ofChat(name, options);
}

Client.prototype.ofChat = function (name, options) {
    if ('undefined' === typeof (handle = Client.chats[name])) {
        handle = this.factoryScoketObject(Chat, options);
        Client.chats[name] = handle;
    }

    return handle;
}

// client.factorySocketObject('Chat')
Client.prototype.factorySocketObject = function (klass, options) {
    return Chat.create(options, this.socket)
}

Client.prototype.openGroup = function (user_opts, callback, error) {

}