var Dispatcher = require('../../../node_modules/flux').Dispatcher;
var assign = require('react/lib/Object.assign');
var ActionSources = require('../constants/Constants').ActionSources;

// var AppDispatcher = assign({}, Dispatcher.prototype, {

//   handleViewAction: function(action) {
//     this.dispatch({
//       source: ActionSources.VIEW_ACTION,
//       action: action
//     });
//   },

// })

var AppDispatcher = function() {
  Dispatcher.call(this);
};

AppDispatcher.prototype = Object.create(Dispatcher.prototype);
AppDispatcher.prototype.handleViewAction = function(action) {
  this.dispatch({
    source: ActionSources.VIEW_ACTION,
    action: action
  });
};

module.exports = new AppDispatcher();