var rewire = require('rewire');
var userController = rewire('../../server/users/userController');
// var jasmine = require('jasmine');

var request = require('request');


describe('Sign Up functionality tests', function(){
  var url = 'http://127.0.0.1:8080'

  var signUp = function(data, callback){
    var username = data.username;
    var password = data.password;
    request.post(
      {
        header: {'content-type': 'application/x-www-form-urlencoded'},
        url: url+'/signup', 
        json: data
      }, function(error, response, body){
        if(error) console.log(error.message);
        // token = body.token;
        callback(response, body);
    });
  }

  // signin(function(){return true});

  var signout = function(callback){
    request.get({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      url: url+'/logout',
      headers: {'Authorization': 'Bearer ' + token},
    }, function(error, response, body){
      callback(error, response, body);
    });
  }

  xit('should let new users signup', function(done){
    var data = {
      username: "admin3@blah.com",
      password: "tightHips",
      utility_username: 'johnDoe',
      utility_password: '1234',
      pgeFullName: 'John Doe',
    }
    // signUp(data, function(response, body){
      checkMock = function(req, res, cb){
        console.log('success!');
      }
      var mockUser = {
        findOne: function(obj){
          return {user: 'found'}
        }
      }
      var resMock = {
        send: function(){}
      }
      console.log(userController);
      userController.__set__('checkUsernameAvail', checkMock);
      userController.__set__('User', mockUser);
      
      console.log(userController.__get__('checkUsernameAvail'))
      spyOn(mockUser, 'findOne');
      
      userController.signUp({body: data}, resMock);

      // expect(userController.checkUsernameAvail).toHaveBeenCalled();
      expect(mockUser.findOne).toHaveBeenCalled();
      done();
    
  });

  it('should not let multiple users with same name signup', function(done){
    signUp({username: 'admin1@blah.com', password: 'tightHips'}, function(response, body){
      expect(response.statusCode).toEqual(418);
      done()
    });
  });


  //almost working but still needs work
  xit('should have signup route', function(done){
    request.post({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      url: url+'/signup',
      json: {
        username: "admin3@blah.com",
        password: "tightHips",
        utility_username: "testy",
        utility_password: 'tightHips',
        pgeFullName: 'John Doe'
      }
    }, function(error, response, body){
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});