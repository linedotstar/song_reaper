
/*
 * GET home page.
 */
// FIXME app doesn't exist here
var config = require('config'),
    util = require('util'),
    sio = require('../io'),
    ServiceHub = require('../lib/services/serviceHub').ServiceHub;

// Socket.io
// -------------------------------------------------- //
var initSocket = function(serviceHub, channel) {
  console.log('Initializing socket on channel ' + channel);
  sio.of('/' + channel).on('connection', function(socket) {
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

exports.index =  function (req, res) {
 var channel = Math.random(),
     hub = new ServiceHub();
 initSocket(hub, channel);
 res.render('index', {pageTitle: 'SongReaper', channel: 'http://' + config.server.host + '/' + channel});
}