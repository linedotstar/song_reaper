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

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/public/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.send('Error loading index.html');
    }
    writeHead(200);
    res.send(data);
  });
});

app.listen(3000);
console.log('app started');

// Socket.io
// -------------------------------------------------- //

var io = require('socket.io').listen(app.server);

io.sockets.on('connection', function(socket) {
  socket.on('search', function(data) {
    console.log(data);
    serviceHub.search(data.types, data.query);
  });
  serviceHub.on('results', function(data) {
    socket.emit('results', data);
  });
});