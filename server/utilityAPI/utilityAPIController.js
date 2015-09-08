var request = require('request');
var UtilityAPI = require('./UtilityAPI');
var mongoose = require('mongoose');
var MeterReading = require('./MeterReadingModel');
var meterReadingCache = require('./meterReadingCache');
var debounce = require('debounce');

// Query UtilityAPI for all active users
// Get their meter readings from the past 48 hours
var loadNewReadings = function() {

  console.log('Loading new meter readings');
  // Need to add 1 to the Month because Javascript indexes months
  // beginning at 0....because Javascript.
  var now = new Date(Date.now());
  var year = now.getUTCFullYear();
  var month = ("0" + (now.getUTCMonth() + 1)).slice(-2)
  var start_day = ("0" + (now.getUTCDate() - 15)).slice(-2);
  var end_day = ("0" + (now.getUTCDate())).slice(-2);

  // Put start and end dates in the format expected by UtilityAPI
  var start_date = year + '-' + month + '-' + start_day;
  var end_date = year + '-' + month + '-' + end_day;

  UtilityAPI.getActiveUsers(function(accounts){
    // console.log("Active accounts: ", accounts);
    if(Array.isArray(accounts)){
      accounts.forEach(function(account){
        if(account.bill_count > 0){
          UtilityAPI.getIntervalData(account.uid, start_date, end_date, function(intervals){
            populateDB(intervals);
          });
        }
      });
    }
  });
}

// Load those readings into the DB if they are not already there
// findOneAndUpdate will also update an existing record if it changed for some reason
var populateDB = function(intervals){
  intervals.forEach(function(reading){
    // console.log(reading);
    MeterReading.findOneAndUpdate({interval_end: reading['interval_end']}, reading, {upsert: true}, function(err, result){
      if(err){
        throw err;
      }
    });
  });
}

var getAllReadings = function(service_uid, cb){
  
  // 604800000 is 7 days in milliseconds
  var now = new Date(Date.now());
  var lastWeek = new Date(Date.now()-604800000);

  MeterReading.find({'interval_end': {$gt: lastWeek}, 'service_uid': service_uid}, function(err, docs) {
    if (!err){
      meterReadingCache[service_uid] = docs;
      meterReadingCache[service_uid].lastPopulated = now;
      cb(docs);
    } else {throw err;}
  });
}

// loadNewReadings();
debounce(loadNewReadings, 180000)();
// // Run once an hour
setInterval(loadNewReadings, 3600000);

exports.getAllReadings = getAllReadings;
