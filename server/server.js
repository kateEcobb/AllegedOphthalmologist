var express = require('express');
var middleware = require('./config/middleware.js');
require('./config/db.js');

var port = process.env.PORT || 8080;
var app = express();

middleware(app);

app.listen(port);
console.log("Server now listening on port " + port);

module.exports = app;
