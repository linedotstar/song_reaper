var util = require('util'),
    events = require('events'),
    services = [
      'rdio',
      // 'soundcloud',
      'spotify'
    ];

var ServiceHub = function() {
  for(var i = 0; i < services.length; i++) {
    var Service = require('./' + services[i]).Service;
    new Service(this);
  }
  return this;
};
util.inherits(ServiceHub, events.EventEmitter);

ServiceHub.prototype.search = function(types, query) {
  this.emit('search', types, query);
}

exports.ServiceHub = ServiceHub;