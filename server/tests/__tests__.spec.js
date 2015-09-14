"user strict";
var request = require('request');
var userController = require('../users/userController');
var supertest = require('supertest');

describe('Routes', function(){
  var url = 'http://127.0.0.1:8080'
  var token;

  var signin = function(callback){
    request.post(
      {
        header: {'content-type': 'application/x-www-form-urlencoded'},
        url: url+'/signin', 
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
      url: url+'/logout',
      headers: {'Authorization': 'Bearer ' + token},
    }, function(error, response, body){
      callback(error, response, body);
    });
  }

  it('should have route for index', function(done){
    supertest(url)
      .get('/')
      .expect(200)
      .end(function(err, res){
        expect(res.statusCode).toEqual(200);
        done();
      })
  });

  it('should not let multiple people with same name signup', function(done){
    var body = {
      username: "admin4@blah.com",
      password: "tightHips",
      utility_username: "Horsies",
      utility_password: ''
      
    }
    supertest(url)
      .post('/signup')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(418)
      .end(function(error, res){
        expect(res.statusCode).toEqual(418);
        done();
      });
  });

  it('should have POST route for signin', function(done){
      // console.log(token, 'signin');
      expect(token).toBeDefined();
      done();
  }); 

  it('should handle incorrect credintials', function(done){
    // console.log('bad creds');
    var body = {
      username: "blah@blah.com", 
      password: "tightlskdjfl"
    };

    signout(function(){
      supertest(url)
        .post('/signin')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(418)
        .end(function(error, res){
          expect(res.statusCode).toEqual(418);
          signin(function(){ done() });
        })
    })
  });

  it('should have GET route for users meterreadings', function(done){
    // console.log(token, 'meterreadings');
    // var body = {
    //   service_uid: 13984,
    // }
    // supertest(url)
    //   .get('api/user/meterreadings/')
    //   .set({headers: {'Authorization': ('Bearer ' + token)}})
    //   .send(body)
    //   .expect('Content-Type', /json/)
    //   .expect(200)
    //   .end(function(error, res){
    //     console.log(error, res);
    //     expect(Array.isArray(res)).toEqual(true);
    //     done();
    //   })
    request.get({
      headers: {'Authorization': 'Bearer ' + token},
      url: url+'/api/user/meterreadings/',
      json: {},
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
      url: url+'/api/user/changePGE',
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