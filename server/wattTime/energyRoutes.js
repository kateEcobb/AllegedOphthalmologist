var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/getTotalEnergy', energyController.update);
};