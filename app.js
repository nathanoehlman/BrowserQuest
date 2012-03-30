var express = require('express');

var app = express.createServer(),
    port = 7999;
    
// Configuration
app.configure(function(){
    app.set('view cache', false);
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/client'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.listen(port);
console.log("Browser quest client server listening on port %d in %s mode", app.address().port, app.settings.env);