var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;
console.log(ActionTypes);
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
      console.log(data[0]);
      Dispatcher.handleViewAction({
        type: ActionTypes.WATT_LOADED,
        payload: data
      });
    })
    .catch(function(err) {
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
    })

  }
}


module.exports = ViewActions;
