var rewire = require('rewire');
var userController = rewire('../users/userController');
var jasmine = require('jasmine');

// userController.checkUsernameAvail();

describe('Sign Up functionality tests', function(){

  // it('should call checkUsernameAvail', function(){
  //   spyOn(userController.checkUsernameAvail);
  //   userController.signUp({body: {username: 'admin1@blah.com', password: 'tightHips'}});
  //   expect(userController.checkUsernameAvail).toHaveBeenCalled();
  // });
});