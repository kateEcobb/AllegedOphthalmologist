var WattEnergy = require('./energyModel')
var request = require('request');

/* update queries the WattTime API and continually updates the database with new information 
* from the last 24 hours.
*/
var update = function(dateStart, dateEnd){ 
  var holder;
  var update;
  
  var options = { 
    url: 'http://api.watttime.org:80/api/v1/datapoints/?ba=CAISO&start_at='+dateStart+'&end_at='+dateEnd+'&page_size=1000&market=RT5M',
    headers: { 
      'Authorization' : '26fded1eead70b9fb946204aa7d7352b137c56d5'
    }
  };

  //query WattTime API for info from last 24 hours
  request(options, function(err, res, body){ 
      //if no error and API query was OK
    if(!err && res.statusCode === 200){ 
      var data = JSON.parse(body);

      //iterate through results array, check to see if timestamp is in energy database
      for(var i=0; i<data.results.length; i++){ 
        holder = []
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
          WattEnergy.findOneAndUpdate({timestamp: data.results[i].timestamp}, update, {upsert: true}, function(err, result){ 
            if(err) console.log("Problem updating database " + err)
          })
        }
      }
    })

};

var getAllWattData = function(req, res, next){ 
  WattEnergy.find().exec(function(err, data){ 
    if(err){ 
      res.send(500,err);
    } else { 
      res.json(data);
    }
  })
};

setInterval(function(){ 
  console.log('Updated.')
var today = new Date().toISOString().slice(0,-5).replace(/:/g, '%3A')
var yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString().slice(0,-5).replace(/:/g, '%3A')
  update(yesterday, today)
}, 900000);

module.exports = { 
  getAllWattData: getAllWattData
};

