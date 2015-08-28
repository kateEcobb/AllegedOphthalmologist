var keyMirror = require('../../../node_modules/react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    WATT_LOADED: null,
    UTILITY_LOADED: null,
    USER_LOGIN: null,
    USER_LOGIN_FAILURE: null
  }),

  ActionSources: keyMirror({
    VIEW_ACTION: null
  }), 

  ServerRoutes: {
    WATT_TOTAL: '/api/getWattTotal',
    UTILITY_TOTAL: '/api/meterreadings',
    USER_REGISTRATION: '/signup'
  }
};