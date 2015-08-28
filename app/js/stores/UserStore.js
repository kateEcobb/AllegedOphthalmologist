var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;
// console.log(Dispatcher);

var CHANGE_EVENT = 'change';

var user = {
  username: null,
  uid: null
};

var UserStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  setUser: function(user_data) {
    user.username = user_data.username;
    user.uid = user_data.uid;
  },
  getUsername: function(){
    return user.username;
  },
  getUid: function(){
    return user.uid;
  }

});

UserStore.dispatchToken = Dispatcher.register(function (dispatch) {
  var action = dispatch.action;
  if (action.type === ActionTypes.USER_LOGIN) {
    UserStore.setUser(action.payload);
    UserStore.emitChange();
  } 
});

module.exports = UserStore;