var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;

var moment = require('moment');

var CHANGE_EVENT = 'change';

var data = {'Watt': [{}], 'Utility': [{}]};

// For the User Profile Page
var summaryData = {
  weekStartDate: null,
  weekEndDate: null,
  weekStartString: null,
  weekEndString: null,
  latestWeekKwhUsed: 0,
  wattTimeMin: null,
  wattTimeMax: null,
  redThreshold: 0,
  greenIntervalCount: 0,
  redIntervalCount: 0,
  greenIntervalKwh: 0,
  redIntervalKwh: 0, 
  caliDifference: 0, 
  qualifier: null
};


// Bins for time intervals for red/yellow/green grid times
var yellowTimes = [];
var greenTimes = [];
var redTimes = [];

var DataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  logoutUser: function(){
    data.Utility = [{}];
  },
  sortByTimestamp: function(a,b) {
    var dateA = new Date(a.interval_end);
    var dateB = new Date(b.interval_end);
    if (dateA < dateB)
      return -1;
    if (dateA > dateB)
      return 1;
    return 0;
  },
  getCarbonRange: function(){
    var wattTimeData = data.Watt;

    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;
    for(var i = 0; i < wattTimeData.length; i++){
      if(wattTimeData[i].carbon !== null && wattTimeData[i].carbon > max){
        max = wattTimeData[i].carbon;
      }
      else if(wattTimeData[i].carbon !== null && wattTimeData[i].carbon < min){
        min = wattTimeData[i].carbon;
      }
    }
    summaryData.wattTimeMin = min;
    summaryData.wattTimeMax = max;
  },
  getBin: function(carbon){
    if(carbon >= summaryData.redThreshold){
      return 'red';
    }
    else {
      return 'green';
    }
  },
  getLatestWeekBounds: function(sortedUtilityData){
    var dayMs = 86400000;

    var end = sortedUtilityData.length-1;
    var end_time = new Date(sortedUtilityData[end].interval_end);
    var start_time = new Date(end_time - (dayMs*7));

    summaryData.weekStartDate = start_time;
    summaryData.weekEndDate = end_time;

    summaryData.weekStartString = moment(start_time).format('MMMM Do YYYY');
    summaryData.weekEndString = moment(end_time).format('MMMM Do YYYY');

    //console.log(summaryData.weekStartString, summaryData.weekEndString);
    return [start_time, end_time];
  },
  computeBrackets: function(){
    var currentBin = null;
    var currentBracket = null;
    for(var i = 0; i < data.Watt.length; i++){
      if(currentBin === null){
        currentBracket = [null, null];
        currentBracket[0] = data.Watt[i].timestamp;
        currentBin = this.getBin(data.Watt[i].carbon);
      }
      else if(this.getBin(data.Watt[i].carbon) !== currentBin || i === data.Watt.length-1){
        currentBracket[1] = data.Watt[i].timestamp;
        if(currentBin === 'green'){
          greenTimes.push(currentBracket);
        }
        else{
          redTimes.push(currentBracket);
        }
        currentBin = null;
      }
    }
  },
  countUtilityApiPoints: function(){
    var utlityApiData = data.Utility;

    // Reset Data
    summaryData.redIntervalKwh = 0;
    summaryData.greenIntervalKwh = 0;

    summaryData.greenIntervalCount = 0;
    summaryData.redIntervalCount = 0;

    var count = 0;
    for(var i = 0; i < utlityApiData.length; i++){
      var intervalTime = new Date(utlityApiData[i].interval_start);
      var foundTime = false;


      for(var j = 0; j < redTimes.length; j++){
        var redStartTime = new Date(redTimes[j][0]);
        var redEndTime = new Date(redTimes[j][1]);
        if(intervalTime > redStartTime && intervalTime < redEndTime){
          summaryData.redIntervalCount++;
          summaryData.redIntervalKwh += utlityApiData[i].interval_kWh;
          foundTime = true;
          count++;
          break;
        }
      }
      
      if(!foundTime) {
        summaryData.greenIntervalCount++;
        summaryData.greenIntervalKwh += utlityApiData[i].interval_kWh;
        count++;
      }
    }
      
    // Round here to avoid ridiculous numbers because JavaScript
    summaryData.redIntervalKwh = Math.round(summaryData.redIntervalKwh * 100) / 100;
    summaryData.greenIntervalKwh = Math.round(summaryData.greenIntervalKwh * 100) / 100;
    
    // Compute total kWh used
    summaryData.latestWeekKwhUsed = summaryData.redIntervalKwh + summaryData.greenIntervalKwh; 
  },
  processUtilityData: function(utilityData){
    sortedUtilityData = utilityData.sort(this.sortByTimestamp);
    var weekBounds = this.getLatestWeekBounds(sortedUtilityData);
    
    this.computeBrackets();
    this.countUtilityApiPoints();
    
    var difference = 139 - Math.round(summaryData.latestWeekKwhUsed);
    summaryData.qualifier = (difference < 0) ? 'above' : 'below';
    summaryData.caliDifference = Math.abs(difference);
  },
  processWattTimeData: function(){
    this.getCarbonRange();
    // console.log(summaryData.wattTimeMin, summaryData.wattTimeMax);

    data.Watt = data.Watt.sort(this.sortByTimestamp);
    var oneThirdRange = ((summaryData.wattTimeMax - summaryData.wattTimeMin)/3);
    
    summaryData.redThreshold = summaryData.wattTimeMin + (oneThirdRange * 2);

  },
  setData: function(newData, key){
    data[key] = newData;
    if(key === 'Utility'){
      this.processUtilityData(newData);
    }
    else if(key === 'Watt'){
      this.processWattTimeData(newData);
    }
  },
  getData: function(key){
    if (key) {
      return data[key];
    }
    else {
      return data;
    }
  },
  getSummaryData: function(){
    return summaryData;
  }
});
DataStore.dispatchToken = Dispatcher.register(function (dispatch) {
  
  var action = dispatch.action;
  if (action.type === ActionTypes.WATT_LOADED) {
    DataStore.setData(action.payload, 'Watt');
    DataStore.emitChange();
  } 
  else if (action.type === ActionTypes.UTILITY_LOADED) {
    DataStore.setData(action.payload, 'Utility');
    DataStore.emitChange();
  }
  // Clear user's utility data on logout
  else if (action.type === ActionTypes.USER_LOGOUT){
    // console.log('logging out');
    DataStore.logoutUser();
  } 

});

module.exports = DataStore;