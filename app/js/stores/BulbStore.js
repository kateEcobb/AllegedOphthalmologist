var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;

var CHANGE_EVENT = 'change';

var data = {};

var BulbStore = assign({}, EventEmitter.prototype, {
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
BulbStore.dispatchToken = Dispatcher.register(function (dispatch) {
  
  var action = dispatch.action;
  if (action.type === ActionTypes.SET_BULB_COLOR) {
    BulbStore.setData(action.payload);
    BulbStore.emitChange();
  } 
});

module.exports = BulbStore;