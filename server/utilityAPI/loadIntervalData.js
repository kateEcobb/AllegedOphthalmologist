var request = require('request');
var UtilityAPI = require('./UtilityAPI');
var mongoose = require('mongoose');
var MeterReading = require('./MeterReadingModel');

// Need to add 1 to the Month because Javascript indexes months
// beginning at 0....because Javascript.
var now = new Date(Date.now());
var year = now.getUTCFullYear();
var month = ("0" + (now.getUTCMonth() + 1)).slice(-2)
var start_day = ("0" + (now.getUTCDate() - 2)).slice(-2);
var end_day = ("0" + (now.getUTCDate())).slice(-2);

// Put start and end dates in the format expected by UtilityAPI
var start_date = year + '-' + month + '-' + start_day;
var end_date = year + '-' + month + '-' + end_day;

setInterval(function(){ 
  console.log('Updated.')
var today = new Date().toISOString().slice(0,-5).replace(/:/g, '%3A')
var yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString().slice(0,-5).replace(/:/g, '%3A')
  update(yesterday, today)
}, 3600000);

// Query UtilityAPI for all active users
// Get their meter readings from the past 48 hours
var getReadings = function() {
  UtilityAPI.getActiveUsers(function(accounts){
    accounts.forEach(function(account){
      if(account.bill_count > 0){
        UtilityAPI.getIntervalData(account.uid, start_date, end_date, function(intervals){
          populateDB(intervals);
        });
      }
    });
  });
}

// Load those readings into the DB if they are not already there
// findOneAndUpdate will also update an existing record if it changed for some reason
var populateDB = function(intervals){
  intervals.forEach(function(reading){
    MeterReading.findOneAndUpdate({updated: reading['updated']}, reading, {upsert: true}, function(err, result){
      if(err){
        console.log(err);
        throw err;
      }
      console.log(result);
    });
  });
}