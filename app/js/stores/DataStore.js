var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');

var CHANGE_EVENT = 'change';

var data = {};

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
  setData: function(newData){
    data = newData;
  },
  getData: function(){
    return data;
  }
});
DataStore.dispatchToken = Dispatcher.register(function (action) {
  if (action.type === 'DATA_LOADED') {
    DataStore.setData(action.payload);
    DataStore.emitChange();
  }
});

module.exports = DataStore;