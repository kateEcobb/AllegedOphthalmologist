var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;

//routes
var register = require('../components/RegistrationView.jsx');
var profile = require('../components/ProfileView.jsx');
var login = require('../components/LoginView.jsx');
var graphs = require('../components/MainView.jsx')

var CHANGE_EVENT = 'change';

var menuItems = [
  { route: 'home', text: 'Home', display: true },
  { route: register, text: 'Register', display: true },
  { route: profile, text: 'Profile', reqLogin: true, disabled: true, display: false },
  { route: login, text: 'Login', display: true },
  { route: graphs, text: 'Current Energy', display: true },
  { route: 'logout', text: 'Logout', reqLogin: true, display: false }
]

var MenuStore = assign({}, EventEmitter.prototype, {
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  getActiveItems: function(){
    var display = [];
    menuItems.forEach(function(item){
      if(item.display){
        display.push(item);
      }
    });
    return display;
  },

  toggleDisplay: function(item){
    item.display = !item.display;
  }

})

MenuStore.dispatchToken = Dispatcher.register(function(dispatcher){

  var action = dispatcher.action;
  var itemsToToggle = [
    menuItems[1],
    menuItems[2],
    menuItems[3],
    menuItems[5]
  ];
  if(action.type === ActionTypes.USER_LOGIN || action.type === ActionTypes.USER_LOGOUT){
    itemsToToggle.forEach(function(item){
      MenuStore.toggleDisplay(item);
    })
    MenuStore.emitChange();
  }
    
})

module.exports = MenuStore;
