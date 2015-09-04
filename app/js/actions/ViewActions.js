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

  getBulbColor: function(){ 
    return util.getHexCode()
      .then(function(code){ 
        Dispatcher.handleViewAction({ 
          type: ActionTypes.SET_BULB_COLOR, 
          payload: code
        });
      })
      .catch(function(err){ 
        throw err;
      })
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

  loadUtilityUser: function() {

    return util.getUtilityUser()
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
      
      //console.log("Got User: ", user);
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGIN,
        payload: user
      });
    })
    .catch(function(err){
      // Login not successful
      console.log('Login not successful: ', err);
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: err
      });
    });
  },

  logoutUser: function(){
    util.logoutUser()
    .then(function(){
      console.log(arguments);
      Dispatcher.handleViewAction({
        type: ActionTypes.USER_LOGOUT,
        payload: null
      });
    })
    .catch(function(err){
      console.log('Log out failed: ', err);
      // Dispatcher.handleViewAction({
      //   type: ActionTypes.USER_LOGIN_FAILURE,
      //   payload: err
      // });
    });
  },

  updateUserPGE: function(update_data){
    util.updateUserPGE(update_data)
    .then(function(response){
      //console.log("Updated PGE data: ", user);
      Dispatcher.handleViewAction({
        type: ActionTypes.PGE_UPDATE_SUCCESS,
        payload: response
      });
    })
    .catch(function(err){
      // Login not successful
      // console.log('Update not successful: ', err);
      Dispatcher.handleViewAction({
        type: ActionTypes.PGE_UPDATE_FAILURE,
        payload: err
      });
    });
  },

  toggleNavMenu: function() {
    Dispatcher.handleViewAction({
      type: ActionTypes.TOGGLE_NAV_MENU,
      payload: null
    });
  },

  loadModal: function(modal){
    Dispatcher.handleViewAction({
      type: ActionTypes.LOAD_MODAL,
      payload: modal
    })
  },
  // changeGraphView: function(event) {
  //   Dispatcher.handleViewAction({
  //     type: ActionTypes.MAIN_GRAPH_CHANGE,
  //     payload: event
  //   });
  // }
};

module.exports = ViewActions;
