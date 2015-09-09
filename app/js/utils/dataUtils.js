var Weekdays = require('../constants/Constants').Weekdays;
var Months = require('../constants/Constants').Months;

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

// For the given user datum, find the sorted watt element with the nearest timestamp and return the carbon emission lbs/Mwh * Kwh * (Mwh / 1000 Kwh)
// If the user time falls in a gap, do linear extrapolation to find predicted carbon emission
var userCarbonEmission = function(watts, datum) {
  var time = new Date(datum.interval_start);
  var power = parseFloat(datum.interval_kWh);
  var wattIndex = 0;
  var iter = 0;
  var userCarbonEmission = 0;

  // Bisect watt data by given time and return right index 
  while (!wattIndex) {
    // console.log("bisect", [time, watts[iter].time, wattIndex]);
    if (time <= watts[iter].time) {
      wattIndex = iter;
    }
    iter++;
  }
  // console.log("Watts", [wattIndex, iter, datum]);

  // If we have a left index
  if (watts[wattIndex - 1]) {

    var x1 = watts[wattIndex - 1].time;
    var x2 = watts[wattIndex].time;
    
    var y1 = parseInt(watts[wattIndex - 1].carbon);
    var y2 = parseInt(watts[wattIndex].carbon);

    var timeDiff = [time - x1, x2 - time];

    // If we have a large time gap between the time and the left and rigth indices // Let's say 20 minutes right now
    if (Math.min.apply(this, timeDiff) > 20 * 60 * 1000) {
      // do linear calculation

      // Delta Y
      var deltaY = y2 - y1;
      // Delta X
      var deltaX = x2 - x1;
      // Slope
      var slope = deltaY / deltaX;
      // Initial condition
      var y0 = y1 - (slope * x1);
      // Linear extrapolation
      var linearCarbonRatio = (time.getTime() * slope) + y0;
      // Do emissions calculation
      userCarbonEmission = [linearCarbonRatio * power / 1000, {ratio: linearCarbonRatio, left: watts[wattIndex - 1], right: watts[wattIndex]}, time, power];
      console.log("linear", linearCarbonRatio, power, [x1, x2, time]);
    }
    else {
      wattIndex = timeDiff[0] <= timeDiff[1] ? wattIndex - 1 : wattIndex;
      console.log("standard", watts[wattIndex].carbon, power);
      userCarbonEmission = [watts[wattIndex].carbon * power / 1000, watts[wattIndex], time, power]; 
    }

  }
  else {
    userCarbonEmission = watts[wattIndex].carbon * power / 1000;
    console.log("weird", watts[wattIndex].carbon, power);
  }
  console.log("emit", userCarbonEmission);
  return userCarbonEmission;
};

var latestRT5MIndex = function(array) {
  var index;
  for (var i = 0; i < array.length; i++) {
    if (array[i].market === "RT5M") {
      index = i;
    }
  }
  return index;
};

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
        // time: new Date((new Date(state.data.Watt[i].timestamp)).getTime()),
        time: new Date(state.data.Watt[i].timestamp),
        id: (new Date(state.data.Watt[i].timestamp)).getTime(),
        market: state.data.Watt[i].market,
      });
    }

    watts.sort(function(a, b) {
      return a.time - b.time;
    });

    var wattTimeFilter = 24 * 60 * 60 * 1000 * 5; // 5 Days
    var wattDateFilter = new Date(Date.now() - wattTimeFilter);
    watts = data.Watt = watts.filter(function(datum) {
      return datum.time > wattDateFilter ? true : false;
    });

    // Need to filter out old DAHR from watt data since the RT5M is updating
    var index = latestRT5MIndex(watts);

    // find latest RT5M and then filter out DAHR to that index 
    watts = data.Watt = watts.filter(function(datum, i, data) {

      // ADDON we also need to filter out null value data points
      if (datum.point === null) {
        return false;
      }

      // For situation where RT5M and DAHR occur at same time, but DAHR is next index
      if (data[i - 1] && datum.market ==="DAHR" && datum.time.getTime() === data[i - 1].time.getTime()) {
        return false;
      }

      // If the datapoint is past the filter point
      if (i > index ) {
        return true;
      }
      // otherwise filter out the point if it is a DAHR datapoint
      else if (datum.market === "DAHR") {
        return false;
      }
      else {
        return true;
      }
    });

    // Utility Data //////////
    var utilities = data.Utility = [];
    for (i = 0; i < state.data.Utility.length; i++) {
      utilities.push({
        point: parseFloat(state.data.Utility[i].interval_kWh),
        // time: new Date((new Date(state.data.Utility[i].interval_start)).getTime()),
        time: new Date(state.data.Utility[i].interval_start),
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
    var weekTime = 24 * 60 * 60 * 1000 * 12;
    var weekDate = new Date(Date.now() - weekTime);
    utilities = data.Utility = utilities.filter(function(datum) {
      return datum.time > weekDate ? true : false;
    });

    return data;
  },

  parseWattData: function(state, dateFilter) {

    var shouldFilter = true;
    if (arguments.length === 2) {
      shouldFilter = dateFilter;
    }

    var wattTimeFilter = 24 * 60 * 60 * 1000 * 5; // 5 Days
    var wattDateFilter = shouldFilter ? new Date(Date.now() - wattTimeFilter) : 0;

    var watts = [];
    for (var i = 0; i < state.data.Watt.length; i++) {
      var wattTime = new Date(state.data.Watt[i].timestamp);
      if (wattTime >= wattDateFilter) {
        watts.push({
          point: state.data.Watt[i].carbon,
          // time: new Date((new Date(state.data.Watt[i].timestamp)).getTime()),
          time: wattTime,
          id: wattTime.getTime(),
          market: state.data.Watt[i].market,
        });
      }
    }

    watts.sort(function(a, b) {
      return a.time - b.time;
    });

    // Need to filter out old DAHR from watt data since the RT5M is updating
    var index = latestRT5MIndex(watts);

    // find latest RT5M and then filter out DAHR to that index 
    watts = watts.filter(function(datum, i, data) {

      // ADDON we also need to filter out null value data points
      if (datum.point === null) {
        return false;
      }

      // For situation where RT5M and DAHR occur at same time, but DAHR is next index
      if (data[i - 1] && datum.market ==="DAHR" && datum.time.getTime() === data[i - 1].time.getTime()) {
        return false;
      }

      // If the datapoint is past the filter point
      if (i > index ) {
        return true;
      }
      // otherwise filter out the point if it is a DAHR datapoint
      else if (datum.market === "DAHR") {
        return false;
      }
      else {
        return true;
      }
    });

    return watts;
  },

  parseUserKwhData: function(state) {
    var userKwh = [];
    var weekTime = 24 * 60 * 60 * 1000 * 10;
    var weekDate = new Date(Date.now() - weekTime);

    for (var i = 0; i < state.data.Utility.length; i++) {
      var userTime = new Date(state.data.Utility[i].interval_start);
      if (userTime >= weekDate) {
        userKwh.push({
          point: parseFloat(state.data.Utility[i].interval_kWh),
          time: userTime,
          id: userTime.getTime(),
        });
      }
    }

    userKwh = userKwh.sort(function(a, b) {
      return a.time - b.time;
    });

    return userKwh;
  },

  parseUserCarbonData: function(state) {

    var watts = [];
    for (var i = 0; i < state.data.Watt.length; i++) {
      watts.push({
        carbon: parseInt(state.data.Watt[i].carbon),
        time: new Date(state.data.Watt[i].timestamp),
      }); 
    }

    watts = watts.sort(function(a, b) {
      return a.time - b.time;
    });

    var weekTime = 24 * 60 * 60 * 1000 * 7 * 2;
    var weekDate = new Date(Date.now() - weekTime);
    var userCarbon = [];

    for (i = 0; i < state.data.Utility.length; i++) {
      var userTime = new Date(state.data.Utility[i].interval_start);
      if (userTime >= weekDate) {
        var userEmission = userCarbonEmission(watts, state.data.Utility[i]);
        userCarbon.push({
          point: userEmission[0], 
          time: userTime,
          id: userTime.getTime(),
          TEST: userEmission,
        });
      }
    }

    userCarbon = userCarbon.sort(function(a, b) {
      return a.time - b.time;
    });
    console.log("wattTest", watts);
    console.log("userTest", userCarbon);
    return userCarbon;
  },

  findDangerZones : function(watts, timeFrame) {
    // data is parsed watt data
    var dangerZones = [];
    var dangerZonesResults = [];
    var zone = [];
    var inZone = false;

    // Need to set up better filtering for the determining start and end points
    watts.forEach(function(datum, i) {
      if (datum.point >= 1250 && !inZone) {
        zone.push(datum.time);
        inZone = !inZone;
      }
      else if (datum.point <= 1250 && inZone) {
        // zone.push(datum.time);
        zone.push(watts[i - 1].time);
        dangerZones.push(zone);
        zone = [];
        inZone = !inZone;
      }
      else if (i === watts.length - 1 && inZone) {
        zone.push(datum.time);
        dangerZones.push(zone);
        zone = [];
        inZone = !inZone;
      }
    });

    dangerZones.forEach(function(datum) {
      if (datum[0] >= timeFrame[0] && datum[1] <= timeFrame[1]) {
        dangerZonesResults.push(datum);
      }
      else if (datum[1] > timeFrame[0] && datum[0] < timeFrame[0]) {
        dangerZonesResults.push([timeFrame[0], datum[1]]);
      }
      else if (datum[0] < timeFrame[1] && timeFrame[1] < datum[1]) {
        dangerZonesResults.push([datum[0], timeFrame[1]]);
      }
    });


    // Array of tuples
    return dangerZonesResults;
  },

  formatFocusDate : function(date) {
    var num = date.getDate();
    var day = Weekdays[date.getDay()];

    var fullHour = date.getHours();
    var minutes = date.getMinutes();
    var hours = 12;
    var latin = fullHour >= 12 ? "PM" : "AM";

    // Format the Hours
    if (fullHour !== 0 && fullHour !== 12) {
      hours = fullHour % 12;
    }
    // Format the Minutes
    if (minutes === 0) {
      minutes = "00";
    }

    return day + ' ' + num + ', ' + hours + ':' + minutes + ' ' + latin;
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

};