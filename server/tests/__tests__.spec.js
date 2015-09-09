"user strict";
var request = require('request');
var userController = require('../users/userController');

describe('Routes', function(){
  var token;

  var signin = function(callback){
    request.post(
      {
        header: {'content-type': 'application/x-www-form-urlencoded'},
        url: 'http://127.0.0.1:8080/signin', 
        json: {username: "admin1@blah.com", password: "tightHips"}
      }, function(error, response, body){
        if(error) console.log(error.message);
        // console.log(token);
        token = body.token;
        callback(token);
    });
  }

  signin(function(){return true});

  var signout = function(callback){
    request.get({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      url:'http://127.0.0.1:8080/logout',
      headers: {'Authorization': 'Bearer ' + token},
    }, function(error, response, body){
      callback(error, response, body);
    });
  }

  it('should have route for index', function(done){
    request('http://127.0.0.1:8080/', function(error, response, body){
      expect(typeof body).toEqual('string');
      done();
    });
  });

  //almost working but still needs work
  xit('should have signup route', function(done){
    request.post({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      url: 'http://127.0.0.1:8080/signup',
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

  it('should not let multiple people with same name signup', function(done){
    request.post({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      url: 'http://127.0.0.1:8080/signup',
      json: {
        username: "admin4@blah.com",
        password: "tightHips",
        utility_username: "Horsies",
        utility_password: ''
      }
    }, function(error, response, body){
      expect(response.statusCode).toEqual(418);
      done();
    });
  });

  it('should have POST route for signin', function(done){
      console.log(token, 'signin');
      expect(token).toBeDefined();
      done();
  }); 

  it('should handle incorrect credintials', function(done){
    console.log('bad creds');
    signout(function(){
      request.post(
      {
        header: {'content-type': 'application/x-www-form-urlencoded'},
        url: 'http://127.0.0.1:8080/signin', 
        json: {username: "blah@blah.com", password: "tightlskdjfl"}
      }, function(error, response, body){
        if(error) console.log('=================', error.message);
        expect(response.statusCode).toEqual(418);
        signin(function(){done()});
      });
    })
  });

  it('should have GET route for users meterreadings', function(done){
    console.log(token, 'meterreadings');
    request.get({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      headers: {'Authorization': 'Bearer ' + token},
      url: 'http://127.0.0.1:8080/api/user/meterreadings/',
      json: {service_uid: 13984},
    }, function(error, response, body){
      expect(Array.isArray(body)).toEqual(true);
      done();
    })
  });

  //sort of working will come back to it later
  xit('should have POST route for changing PG&E info', function(done){
    userController.changePGEData = jasmine.createSpy('test');
    request.post({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      headers: {'Authorization': 'Bearer ' + token},
      url: 'http://127.0.0.1:8080/api/user/changePGE',
      json: {}
    }, function(error, response, body){
    })
    expect(userController.changePGEData).toHaveBeenCalled();
    done();
  });


  it('should have GET route for logout', function(done){
    // console.log(token, 'logout');
    signout(function(error, response, body){
      expect(body).toEqual('"Redirect to home"');
      done();
    })
  });

});