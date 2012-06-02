var spotify = require('spotify');

var hub;
exports.register = function(h) {
  hub = h;
  hub.on('search', search);
}

var search = function(type, query) {
  spotify.search({type: type, query: query}, function(error, data) {
    hub.emit('results', parseData(data));
  });
}

var parseData = function(data) {
  var results = [];
  for(var i = 0; i < data.artists.length; i++) {
    results.push(data.artists[i].name);
  }
  return {
    service: 'spotify',
    results: results
  };
}