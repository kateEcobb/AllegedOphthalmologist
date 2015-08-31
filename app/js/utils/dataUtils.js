// For the given utility object, find the watt element with the nearest timestamp and return index of watt
// element
var nearestTimeIndex = function(array, datum) {
  var time = new Date(datum.interval_start);
  for (var i = 0; i < array.length - 1; i++) {
    if (array[i].time < time && time <= array[i + 1].time ) {
      return i;
    }
  }
  return array.length - 1;
};

module.exports = {

  // Parses the given state data into what we need
  parseData: function(state) {
    var data = {};

    // Watt Data ////////////
    var watts = data.Watt = [];
    for (var i = 0; i < state.data.Watt.length; i++) {
      watts.push({
        carbon: parseInt(state.data.Watt[i].carbon),
        time: new Date(state.data.Watt[i].timestamp),
        id: state.data.Watt[i]._id
      });
    }
    watts.sort(function(a, b) {
      return a.time - b.time;
    });

    // Utility Data //////////
    var utilities = data.Utility = [];
    for (var i = 0; i < state.data.Utility.length; i++) {
      utilities.push({
        power: parseFloat(state.data.Utility[i].interval_kWh),
        time: new Date(state.data.Utility[i].interval_start),
        ratio: watts[nearestTimeIndex(watts, state.data.Utility[i])].carbon, 
        id: state.data.Utility[i]._id
      });
    }
    utilities.sort(function(a, b) {
      return a.time - b.time;
    });
    utilities = data.Utility = utilities.filter(function(datum) {
      if (datum.time >= watts[0].time && datum.time <= watts[watts.length - 1].time) {
        return true;
      }
      else {
        return false;
      }
    });

    return data;
  }

}