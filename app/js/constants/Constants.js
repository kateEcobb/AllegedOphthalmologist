var keyMirror = require('../../../node_modules/react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    DATA_LOADED: null
  }),

  PayloadSources: keyMirror({
    VIEW_ACTION: null
  }), 

  ServerRoutes: {
    DATA_SOURCE: '/api/data',
  }
};