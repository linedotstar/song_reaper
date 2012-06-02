var flatiron = require('flatiron'),
    path = require('path'),
    fs = require('fs'),
    app = flatiron.app,
    Rdio = require('rdio-node').Rdio;
    
app.config.file({ file: path.join(__dirname, '../../config', 'config.json') });

var hub;
exports.register = function(h) {
  hub = h;
  hub.on('search', search);
}

var rdio = new Rdio({
  consumerKey: app.config.get('services:rdio:key'),
  consumerSecret: app.config.get('services:rdio:secret')
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