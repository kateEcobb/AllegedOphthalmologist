var routes = require('../constants/Constants.js').ServerRoutes;
var UserStore = require('./../stores/UserStore');

// Helper functions

var setAuthHeader = function(){
  $.ajaxSetup({
      headers: { 'Authorization': "Bearer "+UserStore.getToken() }
  });
};

var PostReq = function(route, data){ 
  console.log("Sending POST to " + route + " with " + data);
  setAuthHeader();
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
  setAuthHeader();  
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: route,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        // console.log('succuss in ajax');
        resolve(data);
      },
      error: function(xhr, status, err) {
        // console.log('error in ajax', status, err, xhr)
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
    return GetReq(routes.WATT_BEHIND)
    .then(function(behind) {
      return GetReq(routes.WATT_AHEAD)
      .then(function(ahead) {
        return behind.concat(ahead);
      });
    });
  },

  getHexCode: function(){ 
    return GetReq(routes.BULB_COLOR);
  },

  getUtilityTotal : function() {
    return GetReq(routes.UTILITY_TOTAL);
  },

  getUtilityUser : function() {
    return GetReq(routes.UTILITY_USER);
  },

  registerNewUser: function(data) {
    return PostReq(routes.USER_REGISTRATION, data);
  },

  updateUserPGE: function(update_data){
    return PostReq(routes.PGE_UPDATE, update_data);
    // return new Promise(function(resolve, reject) {
    //   if(false) resolve(update_data);
    //   if(true) reject('err');
    // });
  },

  loginUser: function(data) {
    return PostReq(routes.USER_LOGIN, data);
  },

  logoutUser: function(data){
    return GetReq(routes.USER_LOGOUT);
  },
};