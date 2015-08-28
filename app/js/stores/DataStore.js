var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;

var CHANGE_EVENT = 'change';

var data = {'Watt': [{}], 'Utility': [{}]};

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
  setData: function(newData, key){
    data[key] = newData;
  },
  getData: function(key){
    if (key) {
      return data[key];
    }
    else {
      return data;
    }
  }
});
DataStore.dispatchToken = Dispatcher.register(function (dispatch) {
  // if (action.type === 'DATA_LOADED') {
  //   DataStore.setData(action.dispatch);
  //   DataStore.emitChange();
  // }
  var action = dispatch.action;
<<<<<<< Updated upstream
  // console.log(action);
=======
>>>>>>> Stashed changes
  if (action.type === ActionTypes.WATT_LOADED) {
    DataStore.setData(action.payload, 'Watt');
    DataStore.emitChange();
  } 
  else if (action.type === ActionTypes.UTILITY_LOADED) {
    DataStore.setData(action.payload, 'Utility');
    DataStore.emitChange();
  }

});

module.exports = DataStore;