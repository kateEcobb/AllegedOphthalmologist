var request = require('request');
var TOKENS = require('./../../.tokens');

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
    var url = 'https://utilityapi.com/api/services/'+ uId +
                '/intervals.json?start=' + startDate + '&end=' + endDate;
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

  postNewUser: function(data, cb){ 
    var url = 'https://utilityapi.com/api/accounts/add.json'
    var options = { 
      url: url, 
      method: 'POST', 
      json: true, 
      body: data,
      headers: { 
        'Authorization': authHeader
      }
    }

    makeRequest(options,cb)
  }, 

  getUserServices: function(cb){ 
    


  }
};
