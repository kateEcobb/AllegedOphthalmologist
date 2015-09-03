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

var latestRT5MIndex = function(array) {
  var index;
  for (var i = 0; i < array.length; i++) {
    if (array[i].market === "RT5M") {
      index = i;
    }
  }
  return index;
}

module.exports = {

  // Parses the given state data into what we need
  parseState: function(state) {
    var data = {};

    // Get Timeoffset
    var now = new Date();
    var timeOffset = now.getTimezoneOffset() * 1000 * 60;

    // Watt Data ////////////
    var watts = data.Watt = [];
    for (var i = 0; i < state.data.Watt.length; i++) {
      watts.push({
        point: state.data.Watt[i].carbon,
        time: new Date((new Date(state.data.Watt[i].timestamp)).getTime() + timeOffset),
        id: (new Date(state.data.Watt[i].timestamp)).getTime(),
        market: state.data.Watt[i].market,
      });
    }
    watts.sort(function(a, b) {
      return a.time - b.time;
    });

    // Need to filter out old DAHR from watt data since the RT5M is updating
    var index = latestRT5MIndex(watts);

    // find latest RT5M and then filter out DAHR to that index
    watts = data.Watt = watts.filter(function(datum, i) {
      if (i > index ) {
        return true;
      }
      else if (datum.market === "DAHR") {
        return false;
      }
      else {
        return true;
      }
    });

    // Utility Data //////////
    var utilities = data.Utility = [];
    for (var i = 0; i < state.data.Utility.length; i++) {
      utilities.push({
        point: parseFloat(state.data.Utility[i].interval_kWh),
        time: new Date((new Date(state.data.Utility[i].interval_start)).getTime() + timeOffset),
        ratio: watts[nearestTimeIndex(watts, state.data.Utility[i])].carbon, 
        id: (new Date(state.data.Utility[i].interval_start)).getTime()
      });
    }
    utilities.sort(function(a, b) {
      return a.time - b.time;
    });
    // utilities = data.Utility = utilities.filter(function(datum) {
    //   if (datum.time >= watts[0].time && datum.time <= watts[watts.length - 1].time) {
    //     return true;
    //   }
    //   else {
    //     return false;
    //   }
    // });
    var weekTime = 24 * 60 * 60 * 1000 * 7;
    var weekDate = new Date(Date.now() - weekTime);
    utilities = data.Utility = utilities.filter(function(datum) {
      return datum.time > weekDate ? true : false;
    });
    console.log(data.Utility);
    return data;
  },

  bisectDateIndex : function(sortArray, date) {
    for (var i = 0; i < sortArray.length; i++) {
      if (sortArray[i].time >= date) {
        return i - 1 > 0 ? i - 1 : 0;
      }
    }
  },

  translate: function(x, y) {
    return 'translate(' + (x) + ',' + (y) + ')';
  }

}