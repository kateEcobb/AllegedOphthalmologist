var userController = require('./userController');
var authenticate = require('./../auth/auth');

module.exports = function(app){ 
  app.post('/signup', userController.signUp);
  app.post('/signin', userController.signIn);
  app.post('/api/user/changePGE', authenticate, userController.changePGEData);
  app.get('/logout', authenticate, userController.logOut);

  //-----------FOR DEVELOPMENT ONLY--------------------//
  app.post('/dev/deleteInactiveUsers', userController.deleteInactiveUsers)
}