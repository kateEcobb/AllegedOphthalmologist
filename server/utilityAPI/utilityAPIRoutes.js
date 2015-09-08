var utilityAPIController = require('./utilityAPIController');
var authenticate = require('./../auth/auth');
var meterReadingCache = require('./meterReadingCache');

module.exports = function(app){ 
  
  var dayMs = 86400000;
  app.get('/api/user/meterreadings/', authenticate, function(req, res){
    // console.log('User service id: ', req.service_uid);
    var now = new Date(Date.now());
    // don't hit DB if the user's data is cached and less than a day old
    if (req.service_uid in meterReadingCache && 
         ((now - meterReadingCache[req.service_uid].lastPopulated) < dayMs)){
      console.log('Found user in meter readings cache');
      res.send(meterReadingCache[req.service_uid]);
    } else {
      utilityAPIController.getAllReadings(req.service_uid, function(readings){
        res.send(readings);
      });
    }

  });
};