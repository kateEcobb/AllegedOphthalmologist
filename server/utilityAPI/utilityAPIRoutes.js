var utilityAPIController = require('./utilityAPIController');

module.exports = function(app){ 
  app.get('/api/meterreadings', function(req, res){
    utilityAPIController.getAllReadings(function(readings){
      res.send(readings);
    })
  });
};