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
  }
};