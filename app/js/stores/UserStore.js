var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;
// console.log(Dispatcher);

var CHANGE_EVENT = 'change';

var user = {
  username: null,
  account_auth: null,
  PGE_username: null,
  service_uid: null,
  account_uid: null,
  token: null
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
    // console.log("setting user data in store:", user_data)
    user.username = user_data.username;
    user.account_auth = user_data.account_auth;
    user.PGE_username = user_data.PGE_username;
    user.account_uid = user_data.account_uid;
    user.service_uid = user_data.service_uid;
    user.token = user_data.token;
  },
  getUsername: function(){
    return user.username;
  },
  getServiceUid: function(){
    return user.service_uid;
  },  
  getAccountAuth: function(){
    return user.account_auth;
  },  
  getPGEUsername: function(){
    return user.PGE_username;
  },  
  getAccountUid: function(){
    return user.account_uid;
  },  
  getToken: function(){
    return user.token;
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