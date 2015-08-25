var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function(app){ 
  app.use(bodyParser.json());
  app.use(morgan('combined'));

  app.use(express.static(__dirname + '/../../app/'));
};