var routes = require('../constants/Constants.js').ServerRoutes;

module.exports = {
  getWattTotal : function() {
    return new Promise(function(resolve, reject) {

      $.ajax({
        url: routes.WATT_TOTAL,
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
  },

  getUtilityTotal : function() {
    return new Promise(function(resolve, reject) {

      $.ajax({
        url: routes.UTILITY_TOTAL,
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
  },

  registerNewUser: function(data) {
    // return new Promise(function(resolve, reject) {

    //   $.ajax({
    //     url: routes.USER_REGISTRATION,
    //     method: 'POST',
    //     data: data,
    //     contentType: "application/json",
    //     success: function(data) {
    //       resolve(data);
    //     },
    //     error: function(xhr, status, err) {
    //       reject(err);
    //     }
    //   });

    // });
    // FOR DEBUGGING WITHOUT BACKEND:
    var response = {
      username: "johndoe",
      uid: 14591
    };
    return new Promise(function(resolve, reject) {
      if(true) resolve(response);
      if(false) reject('err');
    });
  }
};