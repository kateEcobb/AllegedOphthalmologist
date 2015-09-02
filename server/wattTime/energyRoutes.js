var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/api/get24HourBehind', energyController.get24HourBehind);
  // app.get('/api/get24HourAhead', energyController.get24HourAhead);

  //----------DEV ONLY--------//
  app.get('/api/get24HourAhead', energyController.getTestData);
};