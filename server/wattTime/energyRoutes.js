var energyController = require('./energyController');

module.exports = function(app){ 
  app.get('/api/get24HourBehind', energyController.get24HourBehind);
  
  //SWITCH BACK!
  if(!process.env.DEPLOY){
    app.get('/api/get24HourAhead', energyController.getTestData);
  }
  else{
    app.get('/api/get24HourAhead', energyController.get24HourAhead);
  } 
  // app.get('/api/get24HourAhead', energyController.get24HourAhead);
};