var WattEnergy = require('./energyModel').WattTotal;
var TestData = require('./energyModel').TestData;
var request = require('request');
var wattTimeToken = require('./../config/tokenConfig.js').wattTimeAPIToken;
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
      var data = JSON.parse(body)

    if (!err && data.results){ 
      var responseArr = [];
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

var getTestData = function(req, res){ 
  TestData.find().exec(function(err, data){ 
    if (err) res.status(500).send("Error in querying test data.");
    else res.json(data);
  })
};

var loadTestData = function(){ 
  var today = new Date().toISOString().slice(0,-5).replace(/:/g, '%3A');
  var tomorrow = new Date(new Date().setDate(new Date().getDate()+1)).toISOString().slice(0,-5).replace(/:/g, '%3A');

  wattTimeQuery(today, tomorrow, 'DAHR', function(datas){
    datas.forEach(function(data){
      TestData.findOneAndUpdate({ 
        timestamp: data.timestamp
      }, data, {upsert:true}, function(err, result){ 
        if (err) console.log("Error adding to TestData.")
      })      
    }) 
  })

};

var WattBehindCache = null;
var lastWBUpdate = Date.parse(new Date(1992,06,08));

var WattBehindUpdater = function(cb){ 
  console.log('Grabbing 24Hour Behind cache...');
  console.log('lastWBUpdate before query '+ new Date(lastWBUpdate));

  var twoDaysAgo = new Date(new Date().setDate(new Date().getDate()-30)).toISOString().slice(0,-5);
  var difference = Date.now() - lastWBUpdate;
  
  if(difference > 3600000){ 
    WattEnergy.find({ 
      timestamp: {$lt: new Date(), $gt: twoDaysAgo}
    }).exec(function(err, data){ 
      if(err){ 
        res.status(500).send("Error in querying Watt database.");
      } else { 
        console.log("Updating 24 Hour Behind Cache.");
        WattBehindCache = data;
        lastWBUpdate = Date.now();
        cb(WattBehindCache);
      }
    });
  } else { 
    cb(WattBehindCache);
  }
};

var get24HourBehind = function(req, res){ 
  WattBehindUpdater(function(cache){ 
    return res.json(cache);
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

loadTestData();
module.exports = { 
  get24HourBehind: get24HourBehind, 
  get24HourAhead: get24HourAhead, 
  getTestData: getTestData,
  WattBehindUpdater: WattBehindUpdater,
  DAHRupdater: DAHRupdater
};

