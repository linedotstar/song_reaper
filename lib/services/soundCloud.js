var http = require('http'),
    client = http.createClient(80, 'api.soundcloud.com'),
    config = require('config');

var headers = {
    'Host': 'api.soundcloud.com',
    'Content-Type': 'application/json'
};

var hub;

exports.register = function(h) {
  hub = h;
  hub.on('search', search);
}

var search = function(types, query) {
  var request = client.request('GET', '/groups.json?q=' + query + '&client_id=' + config.services.soundcloud.key'), headers);
  request.end();
  request.on('response', function(response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('error', function (data) {
      hub.emit('results', data);
    });
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function() {
      hub.emit('results', JSON.parse(data));
    });
  });
}