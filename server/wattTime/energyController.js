var WattEnergy = require('./energyModel')
var request = require('request');
var wattTimeToken = require('../../.tokens.js').wattTimeAPIToken;
var debounce = require('debounce');

//General wattTime query
var wattTimeQuery = function(dateStart, dateEnd, market, cb){ 
 var options = { 
    url: 'http://api.watttime.org:80/api/v1/datapoints/?ba=CAISO&start_at='+dateStart+'&end_at='+dateEnd+'&page_size=1000&market='+market,
    headers: { 
      'Authorization' : wattTimeToken
    }
  };
  request(options, function(err, response, body){ 
    if (err){ 
      console.log("Error querying WattTimeAPI")
      res.status(500).send("Error querying WattTimeAPI")
    } else { 
      var responseArr = [];
      var data = JSON.parse(body)
      for(var i=0; i<data.results.length; i++){ 
        var holder = []
      
      //iterate through genmix data, push into a holder    
          for(var j=0; j<data.results[i].genmix.length; j++){ 
            holder.push({ 
              fuel: data.results[i].genmix[j].fuel, 
              gen_MW: data.results[i].genmix[j].gen_MW
            })
          }
        update = { 
              timestamp: data.results[i].timestamp,
                created_at: data.results[i].created_at, 
                carbon: data.results[i].carbon, 
                genmix: holder, 
                url: data.results[i].url, 
                market: data.results[i].market, 
                freq: data.results[i].freq, 
                ba: data.results[i].ba
        }
        responseArr.push(update);
      }
      cb(responseArr)
    }
  });
};

//Cache of 24 hours of DAHR data for WattTime chart
var DAHRHolder = null;
var lastDAHRUpdate = Date.parse(new Date(1992,06,08));

/* DAHR updater makes a request to the WattTimeAPI if the data is more than an hour old.
 * Otherwise, it just returns the cache.
 */
var DAHRupdater = function(cb){ 
  console.log('Grabbing DAHR cache...');
  console.log('lastDAHRUpdate before query '+ new Date(lastDAHRUpdate));

  var today = new Date().toISOString().slice(0,-5).replace(/:/g, '%3A');
  var tomorrow = new Date(new Date().setDate(new Date().getDate()+1)).toISOString().slice(0,-5).replace(/:/g, '%3A');
  var difference = Date.now() - lastDAHRUpdate;
  
  //hour in milliseconds
  if(difference > 3600000){ 
    wattTimeQuery(today, tomorrow, "DAHR", function(data){ 
      console.log("WattTime Queried.")
      DAHRHolder = data;
      lastDAHRUpdate = Date.now();
      cb(DAHRHolder);
    });    
  } else { 
    cb(DAHRHolder);
  }
};

var get24HourAhead = function(req,res){ 
  DAHRupdater(function(cache){ 
    return res.json(cache)
  })
};

var get24HourBehind = function(req, res){ 
  var yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString().slice(0,-5);
  WattEnergy.find({ 
    timestamp: {$lt: new Date(), $gt: yesterday}
  }).exec(function(err, data){ 
    if(err){ 
      res.status(500).send("Error in querying Watt database.");
    } else { 
      res.json(data);
    }
  });
};

var updateWattData = function() {
  console.log('Updating Watt Data');

  //formatting dates for 24 hour period to be used with WattTime
  var today = new Date().toISOString().slice(0,-5).replace(/:/g, '%3A');
  var yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString().slice(0,-5).replace(/:/g, '%3A');
  
  //query wattTime API with past 24 hours.
  wattTimeQuery(yesterday,today,"RT5M", function(datas){
    datas.forEach(function(data){ 
      WattEnergy.findOneAndUpdate({timestamp: data.timestamp}, data, {upsert: true}, function(err, result){ 
        if(err) console.log("Problem updating database " + err)
      })
    })
  })
};

debounce(updateWattData, 180000)();
setInterval(updateWattData, 900000);

module.exports = { 
  get24HourBehind: get24HourBehind, 
  get24HourAhead: get24HourAhead
};

