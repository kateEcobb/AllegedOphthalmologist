var smartBulbController = require('./smartBulbController');

module.exports = function(app){ 
  app.get('/api/bulbcolor', smartBulbController.getColor);
};