var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;
var util = require('../utils/utils.js');

var ViewActions = {
  loadWatt: function () {
    // TODO: Make an api_utils library to get actual data from our API
    // Using Placeholder data for now
    var data = {
      energy_state: "dirty",
      at_peak: true
    };
    return util.getWattTotal()
    .then(function(data) {
      Dispatcher.handleViewAction({
        type: ActionTypes.WATT_LOADED,
        payload: data
      });
    })
    .catch(function(err) {
      throw err;
    });

  },

  loadUtility: function() {

    return util.getUtilityTotal()
    .then(function(data) {
      Dispatcher.handleViewAction({
        type: ActionTypes.UTILITY_LOADED,
        payload: data
      });
    })
    .catch(function(err) {
      throw err;
    });
  },

  registerUser: function (user_data) {
    util.registerNewUser(user_data)
    .then(function(user){
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGIN,
        payload: user
      });
    })
    .catch(function(err){
      // Registration not successful
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: err
      });
    });
  },

  loginUser: function (user_data) {
    util.loginUser(user_data)
    .then(function(user){
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGIN,
        payload: user
      });
    })
    .catch(function(err){
      // Login not successful
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: err
      });
    });
  }
};

module.exports = ViewActions;
