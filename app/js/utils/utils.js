var routes = require('../constants/Constants.js').ServerRoutes;

// Helper functions
var PostReq = function(route, data){
  
  // console.log("Sending POST to " + route + " with " + data);
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: route,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function(data) {
        resolve(data);
      },
      error: function(xhr, status, err) {
        reject(err);
      }
    });

    // FOR DEBUGGING WITHOUT BACKEND:
    // var response = {
    //   username: "johndoe",
    //   uid: 14591
    // };
    // return new Promise(function(resolve, reject) {
    //   if(false) resolve(response);
    //   if(true) reject('err');
    // });
  });
};
var GetReq = function(route){
  // console.log("Sending GET to " + route);
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: route,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        resolve(data);
      },
      error: function(xhr, status, err) {
        reject(err);
      }
    });
  });
  // FOR DEBUGGING WITHOUT BACKEND:
  // var response = {
  //   username: "johndoe",
  //   uid: 14591
  // };
  // return new Promise(function(resolve, reject) {
  //   if(false) resolve(response);
  //   if(true) reject('err');
  // });
};

module.exports = {
  getWattTotal : function() {
    return GetReq(routes.WATT_TOTAL);
  },

  getUtilityTotal : function() {
    return GetReq(routes.UTILITY_TOTAL);
  },

  registerNewUser: function(data) {
    return PostReq(routes.USER_REGISTRATION, data);
  },

  loginUser: function(data) {
    return PostReq(routes.USER_LOGIN, data);
  }
};