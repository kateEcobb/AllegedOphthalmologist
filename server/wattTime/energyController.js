var TotalEnergy = require('./energyModel')
var request = require('request');

/* update queries the WattTime API and continually updates the database with new information 
* from the last 24 hours.
*/
var update = function(dateStart, dateEnd){ 
  var holder;
  //query WattTime API for info from last 24 hours
  request('http://api.watttime.org:80/api/v1/datapoints/?ba=\
  CAISO&start_at='+dateStart+'&end_at='+dateEnd+'&page_size=1000&market=RT5M', function(err, res, body){ 
      //if no error and API query was OK
    if(!err && res.statusCode === 200){ 
      var data = JSON.parse(body);

      //iterate through results array, check to see if timestamp is in energy database
      for(var i=0; i<data.results.length; i++){ 
        TotalEnergy.find({ 
          timestamp: data.results[i].timestamp
        }).exec(function(err, result){ 
          if(err) console.log("Error in retrieving data from TotalEnergy " + err);
          
          //if an empty array, i.e. nothing returned from the database
          if(result.length === 0){ 
            
            //iterate through genmix data, push into a holder
            holder = []
            for(var j=0; j<data.results[i].genmix.length; j++){ 
              holder.push({ 
                fuel: data.results[i].genmix.fuel, 
                gen_MW: data.results[i].genmix.gen_MW
              })
            }

            //add model to document
            var newEnergy = new TotalEnergy({ 
              timestamp: data.results[i].timestamp,
              created_at: data.results[i].created_at, 
              carbon: data.results[i].carbon, 
              genmix: holder, 
              url: data.results[i].url, 
              market: data.results[i].market, 
              freq: data.results[i].freq, 
              ba: data.results[i].ba
            })
            
            //reset holder
            holder = [];
          }
        })
      }
    }
  })
};



