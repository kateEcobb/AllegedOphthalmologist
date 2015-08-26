var mongoose = require('mongoose'); 

var WattEnergySchema = new mongoose.Schema({ 
  timestamp: String,
  created_at: String, 
  carbon: String, 
  genmix: [{ 
    fuel: String, 
    gen_MW: Number
  }], 
  url: String, 
  market: String, 
  freq: String, 
  ba: String 
}); 

var TotalEnergy = mongoose.model('TotalEnergy', WattEnergySchema);

module.exports = TotalEnergy;