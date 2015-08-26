var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/api/getWattTotal', energyController.getAllWattData);
};