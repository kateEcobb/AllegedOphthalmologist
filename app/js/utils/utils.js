var routes = require('../constants/Constants.js').ServerRoutes;

module.exports = {
  getDataPoints : function() {
    return new Promise(function(resolve, reject) {

      $.ajax({
        url: routes.DATA_SOURCE,
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