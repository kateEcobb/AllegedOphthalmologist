var request = require('request');
var moment = require('moment');
var WattEnergy = require('./../wattTime/energyModel').WattTotal;
var wattTimeToken = require('./../config/tokenConfig.js').wattTimeAPIToken;

// This value gets updated every hour with the findMaxCarbonThisWeek function below
// That function runs once every hour
var weeklyMaxCarbon = 1450;

// This value gets updated every 15 minutes
var colorValue = 0.75;

var getColor = function(req, res){
  res.json(colorValue);
};

var findMaxCarbonThisWeek = function(data) {
  getOneWeek(function(data){
    setMax(data);
  });
};

var setMax = function(data){
  if(data.length > 1){
    var max = data[0].carbon;
    for(var i = 1; i < data.length; i++){
      if(data[i].carbon > max){
        max = data[i].carbon;
      }
    }
    weeklyMaxCarbon = parseFloat(max.toFixed(2));
  }
}

var getOneWeek = function(cb){ 
  var oneWeekAgo = new Date(new Date().setDate(new Date().getDate()-7)).toISOString().slice(0,-5);
  WattEnergy.find({ 
    timestamp: {$lt: new Date(), $gt: oneWeekAgo}
  }).exec(function(err, data){ 
    if(err){ 
      res.status(500).send("Error in querying Watt database.");
    } else { 
      cb(data);
    }
  });
};

function getNearestHour() {
  var date = new Date(Date.now()); 

  date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
  date.setMinutes(0);
  date.setSeconds(0);

  //console.log(date.toISOString());
  var formattedDate = (moment(date).utc().format("YYYY-MM-DDTHH:mm:ss") + 'Z');
  return formattedDate;
}

var getCarbonReading = function(wattimeArray, datestring, cb){
  for(var i = 0; i < wattimeArray.length; i++){
    if(wattimeArray[i].timestamp === datestring){
      cb(wattimeArray[i].carbon);
      break;
    }
  }
}

var makeWattTimeRequest = function(){
  var base_url = 'https://api.watttime.org/api/v1/datapoints/?ba=CAISO&market=DAHR'
  var formattedDate = getNearestHour();
  var url = base_url + '&start_at=' + formattedDate;

  var options = { 
     url: base_url + '&start_at=' + formattedDate,
     headers: { 
       'Authorization' : wattTimeToken
     }
   };

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(JSON.parse(body).results);
      getCarbonReading(JSON.parse(body).results, formattedDate, 
        function(carbon){
          setColorCode(carbon);
        });
    }
    else {
      console.log("Error getting data from WattTime");
    }
  })
};

var setColorCode = function(carbon){
  // divide current carbon rating by highest seen this month
  // to get % of maximum
  var percentMax = carbon/weeklyMaxCarbon;
  if(percentMax > 1){percentMax = 1};

  colorValue = parseFloat(percentMax.toFixed(2));
};

// Check for new bulb color every hour
setTimeout(makeWattTimeRequest, 3600000);

// Check for new max carbon value every 3 hours
setTimeout(findMaxCarbonThisWeek, 10800000)

module.exports = {
  getColor: getColor
}