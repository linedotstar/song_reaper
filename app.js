var app = require('express').createServer(),
    config = require('config'),
    fs = require("fs"),
    serviceHub = require('./lib/services/serviceHub').serviceHub,
    services;

services = [
  'rdio',
  // 'soundcloud',
  'spotify'
];
for(var i = 0; i < services.length; i++) {
  serviceHub.registerService(services[i]);
}

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(config.server.port);
console.log('app started');

// Socket.io
// -------------------------------------------------- //

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
  socket.on('search', function(data) {
    console.log(data);
    serviceHub.search(data.types, data.query);
  });
  serviceHub.on('results', function(data) {
    socket.emit('results', data);
  });
});