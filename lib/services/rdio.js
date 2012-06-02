var Rdio = require('rdio-node').Rdio,
    config = require('config');

exports.Service = function(hub) {
  var rdio = new Rdio({
    consumerKey: config.services.rdio.key,
    consumerSecret: config.services.rdio.secret
    });
  
  hub.on('search', function(types, query) {
    console.log('Making rdio request');
    rdio.makeRequest('search', {types: types, query: query}, function(error, data) {
      console.log('got results!');
      hub.emit('results', parseData(data));
    });
  });

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

  return this;
}