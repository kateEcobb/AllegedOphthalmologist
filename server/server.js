var express = require('express');
var middleware = require('./config/middleware.js');
var db = require('./config/db.js');

var port = process.env.PORT || 8080;
var app = express();

middleware(app);

app.listen(port);
console.log("Server now listening on port " + port);

process.on('SIGTERM', function() {
  console.log('SIGTERM - Closing Server');
  app.close();
});

app.on('close', function() {
  console.log('SIGTERM - Closing Mongo Connection');
  if (db) {
    db.close();
  }
});

module.exports = app;
