var loadIntervalData = require('./loadIntervalData');

module.exports = function(app){ 
  app.get('/api/meterreadings', function(req, res){
    res.send('hey!');
  });
};