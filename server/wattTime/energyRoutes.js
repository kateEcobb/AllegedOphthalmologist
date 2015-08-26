var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/getWattTotal', energyController.getAllWattData);
};