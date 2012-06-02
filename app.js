var flatiron = require('flatiron'),
  path = require('path'),
  fs = require("fs"),
  app = flatiron.app,
  serviceHub = require('./lib/services/serviceHub').serviceHub,
  services;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

services = [
  'rdio',
  // 'soundcloud',
  'spotify'
];
for(var i = 0; i < services.length; i++) {
  serviceHub.registerService(services[i]);
}

app.use(flatiron.plugins.http);

app.router.get('/', function () {
  var self = this;
  fs.readFile(__dirname + '/public/index.html', function (err, data) {
    if (err) {
      self.res.writeHead(500);
      return self.res.end('Error loading index.html');
    }
    self.res.writeHead(200);
    self.res.end(data);
  });
});

app.start(3000);
app.log.info('app started');

// Socket.io
// -------------------------------------------------- //

var io = require('socket.io').listen(app.server);

io.sockets.on('connection', function(socket) {
  socket.on('search', function(data) {
    app.log.info(data);
    serviceHub.search(data.types, data.query);
  });
  serviceHub.on('results', function(data) {
    socket.emit('results', data);
  });
});