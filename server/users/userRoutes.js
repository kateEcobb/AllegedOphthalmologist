var userController = require('./userController');

module.exports = function(app){ 
  app.get('/users', userController.getUserUID);
  app.post('/signup', userController.signUp);
  app.post('/signin', userController.signIn);
}