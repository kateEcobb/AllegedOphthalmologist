var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/api/get24HourBehind', energyController.get24HourBehind);
  
  if(process.env.deploy === 'production'){
    app.get('/api/get24HourAhead', energyController.get24HourAhead);
  }
  else{
    app.get('/api/get24HourAhead', energyController.getTestData);
  } 
};