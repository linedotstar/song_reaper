
/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    sio = require('./io'),
    routes = require('./routes'),
    config = require('config'),
    util = require('util');
    
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.session({secret: config.server.secret}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(config.server.port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});