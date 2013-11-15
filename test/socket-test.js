// var io = require('../src/vendor/socket.io');
var io = require('socket.io-client');
socket = io.connect('http://localhost:5001');


socket.on('connect', function() {
    socket.emit('message', {hello: 'world'});
})