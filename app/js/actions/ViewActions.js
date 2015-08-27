var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;
var util = require('../utils/utils.js');

var ViewActions = {
  loadData: function () {
    // TODO: Make an api_utils library to get actual data from our API
    // Using Placeholder data for now
    var data = {
      energy_state: "dirty",
      at_peak: true
    };
    util.getDataPoints()
    .then(function(res) {
      console.log(res[0]);
    });

    Dispatcher.dispatch({
      type: ActionTypes.DATA_LOADED,
      payload: data
    });
  }
}


module.exports = ViewActions;
