var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/api/get24HourBehind', energyController.get24HourBehind);
};