var request = require('request');
var TOKENS = require('./../config/tokenConfig.js');

// API Authorization Token provided by UtilityAPI:
var authHeader = TOKENS.utilityAPIToken;

var makeRequest = function(options, cb){
  request(options, function(err, response, body){
    if(err){
      throw err;
    }
    cb(JSON.parse(body));
  });
};

module.exports = {
  
  // Provide a UtilityAPI user id for uID
  // Start & End Dates in the form YYYY-MM-DD
  getIntervalData: function(uId, startDate, endDate, cb){
    // var url = 'https://utilityapi.com/api/services/'+ uId +
    //             '/intervals.json?start=' + startDate + '&end=' + endDate;
    // Get all intervals for now
    var url = 'https://utilityapi.com/api/services/'+ uId +'/intervals.json';
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    };

    // console.log(url);
    
    makeRequest(options, cb);
  },

  getActiveUsers: function(cb){
    var url = 'https://utilityapi.com/api/services.json';
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    };
    makeRequest(options, cb);
  }, 

  getUserAccounts: function(cb){ 
    var url = 'https://utilityapi.com/api/accounts.json'
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    };
    makeRequest(options, cb);
  },

  postNewUser: function(data, cb){ 
    var url = 'https://utilityapi.com/api/accounts/add.json'
    var options = { 
      url: url, 
      method: 'POST',
      body: data,
      headers: { 
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    }

    makeRequest(options,cb)
  }, 

  getDeleteCode: function(uid, cb){ 
    var url = 'https://utilityapi.com/api/accounts/'+uid+'/delete.json';
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    };
    makeRequest(options, cb);

  },

  postDeleteCode: function(uid,code,cb){ 
    var url = 'https://utilityapi.com/api/accounts/'+uid+'/delete.json';
    var options = { 
      url: url, 
      method: 'POST',
      body: code,
      headers: { 
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    }
    makeRequest(options,cb)
  }, 

  postPGEMod: function(uid, change, cb){ 
    var url = 'https://utilityapi.com/api/accounts/'+uid+'/modify.json';
    var options = { 
      url: url, 
      method: 'POST',
      body: change,
      headers: { 
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    }
    makeRequest(options,cb)
  }
};
