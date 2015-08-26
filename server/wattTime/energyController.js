var TotalEnergy = require('./energyModel')
var request = require('request');


var update = function(req, res, next, dateStart, dateEnd){ 

  //query WattTime API for info from last 24 hours
  request('http://api.watttime.org:80/api/v1/datapoints/?ba=\
    CAISO&start_at='+dateStart+'&end_at='+dateEnd+'&page_size=1000&market=RT5M', function(err, response, body){ 
      if(!err && res.statusCode === 200){ 
        var data = JSON.parse(body);
        //check to see if id is in energy database, have to iterate through results array
        for(var i=0; i<data.results.length; i++){ 
          TotalEnergy.find({ 
            timestamp: data.results[i].timestamp
          }).exec(function(err, result){ 
            if(err) console.log("Error in retrieving data " + err);
            if(result === []){ 
      
              var newEnergy = new TotalEnergy({ 
                timestamp: data.results[i].timestamp,
                created_at: data.results[i].created_at, 
                carbon: data.results[i].carbon, 
                genmix: [{ 
                  fuel: data.results[i].genmix[, 
                  gen_MW: Number
                }], 
                url: String, 
                market: String, 
                freq: String, 
                ba: String 

              })

            }


          })
      }
    }

  })





};