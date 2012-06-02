var util = require('util'),
    events = require('events');

var ServiceHub = function() {};
util.inherits(ServiceHub, events.EventEmitter);

ServiceHub.prototype.services = {};

ServiceHub.prototype.registerService = function(serviceName) {
  if (this.services[serviceName]) {
    return true;
  }
  this.services[serviceName] = require('./' + serviceName);
  this.services[serviceName].register(this);
}

ServiceHub.prototype.search = function(types, query) {
  this.emit('search', types, query);
}

exports.serviceHub = new ServiceHub();