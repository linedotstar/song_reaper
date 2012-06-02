var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    config = require('config'),
    ServiceHub = require('./lib/services/serviceHub').ServiceHub;

app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({secret: config.server.secret}))

app.get('/', function (req, res) {
  var channel = Math.random(),
      hub = new ServiceHub();
  initSocket(hub, channel);
  res.render('index', {channel: 'http://' + config.server.host + '/' + channel});
});

app.listen(config.server.port);
console.log('app started');

// Socket.io
// -------------------------------------------------- //
var initSocket = function(serviceHub, channel) {
  console.log('Initializing socket on channel ' + channel);
  io.of('/' + channel).on('connection', function(socket) {
    socket.on('search', function(data) {
      console.log('Accepting: ' + data + ' on channel ' + channel);
      serviceHub.search(data.types, data.query);
    });
    serviceHub.on('results', function(data) {
      console.log('Emitting: ' + data + ' on channel ' + channel);
      socket.emit('results', data);
    });
  });
  return channel;
}