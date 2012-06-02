var Rdio = require('rdio-node').Rdio,
    config = require('config');

var hub;
exports.register = function(h) {
  hub = h;
  hub.on('search', search);
}

var rdio = new Rdio({
  consumerKey: config.services.rdio.key,
  consumerSecret: config.services.rdio.secret
  });
  
var search = function(types, query) {
  rdio.makeRequest('search', {types: types, query: query}, function(error, data) {
    hub.emit('results', parseData(data));
  });
}

var parseData = function(data) {
  var results = [];
  for(var i = 0; i < data.result.results.length; i++) {
    results.push(data.result.results[i].name);
  }
  return {
    service: 'rdio',
    results: results
  };
}