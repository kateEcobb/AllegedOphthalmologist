var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var energyRoutes = require('../wattTime/energyRoutes');
var utilityAPIRoutes = require('../utilityAPI/utilityAPIRoutes');


module.exports = function(app){ 
  app.use(bodyParser.json());
  app.use(morgan('dev'));


  app.use(express.static(__dirname + '/../../build'));

  // Routes
  energyRoutes(app);
  utilityAPIRoutes(app);

};