"user strict";
var request = require('request');
var userController = require('../users/userController');

describe('Routes', function(){
  var token;

  beforeEach(function(){
    var getToken = function(){
      request.post(
        {
          header: {'content-type': 'application/x-www-form-urlencoded'},
          url: 'http://127.0.0.1:8080/signin', 
          json: {username: "admin1@blah.com", password: "tightHips"}
        }, function(error, response, body){
          if(error) console.log(error.message);
          token = body.token;
      });
    };

    runs(getToken);

    waitsFor(function(){
      return token;
    });
  });

  it('should have route for index', function(){
    request('http://127.0.0.1:8080/', function(error, response, body){
      // console.log(typeof body, typeof response);
      expect(typeof body).toEqual('string');
    });
  });

  xit('should have POST route for signup', function(){
    request('http://127.0.0.1:8080/', function(error, response, body){
      expect(response).toBe(json);
    });
  });

  it('should have POST route for signin', function(){
    expect(token).toBeDefined();
  });

  it('should have GET route for users meterreadings', function(done){
    request.get({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      headers: {'Authorization': 'Bearer ' + token},
      url: 'http://127.0.0.1:8080/api/user/meterreadings/',
      json: {service_uid: 13984},
    }, function(error, response, body){
      // console.log(body,'==========================');
      expect(Array.isArray(body)).toEqual(true);
      done();
    })
  });

  it('should have POST route for changing PG&E info', function(done){
    userController.changePGEData = jasmine.createSpy('changePGEData');


    request.post({
      header: {'content-type': 'application/x-www-form-urlencoded'},
      headers: {'Authorization': 'Bearer ' + token},
      url: 'http://127.0.0.1:8080/api/user/changePGE',
      json: {stuff: 'stuff'}
    }, function(error, response, body){
    })
    expect(userController.changePGEData).toHaveBeenCalled();
    done();

  });

  xit('should have GET route for logout', function(){
    request('http://127.0.0.1:8080/', function(error, response, body){
      expect(response).toBe(json);
    });
  });

});