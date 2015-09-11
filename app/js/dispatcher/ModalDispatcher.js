var Dispatcher = require('../../../node_modules/flux').Dispatcher;
var ActionSources = require('../constants/Constants').ActionSources;
// var assign = require('../../../node_modules/object-assign');

var ModalDispatcher = function() {
  Dispatcher.call(this);
};

ModalDispatcher.prototype = Object.create(Dispatcher.prototype);
ModalDispatcher.prototype.handleViewAction = function(action) {
  this.dispatch({
    source: ActionSources.VIEW_ACTION,
    action: action
  });
};

module.exports = new ModalDispatcher();


