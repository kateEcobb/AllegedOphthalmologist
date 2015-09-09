var keyMirror = require('../../../node_modules/react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    WATT_LOADED: null,
    UTILITY_LOADED: null,
    USER_LOGIN: null,
    USER_LOGIN_FAILURE: null,
    TOGGLE_NAV_MENU: null,
    PGE_UPDATE_SUCCESS: null,
    PGE_UPDATE_FAILURE: null,
    LOAD_MODAL: null,
    SET_BULB_COLOR: null,
    USER_LOGOUT: null,
    USER_LOGOUT_FAILURE: null,
    SHOW_SNACK: null,
    // MAIN_GRAPH_CHANGE: null,
  }),

  ActionSources: keyMirror({
    VIEW_ACTION: null
  }), 

  ServerRoutes: {
    WATT_BEHIND: '/api/get24HourBehind',
    WATT_AHEAD: '/api/get24HourAhead',
    UTILITY_TOTAL: '/api/meterreadings',
    USER_REGISTRATION: '/signup',
    USER_LOGIN: '/signin',
    BULB_COLOR: '/api/bulbcolor',
    USER_LOGOUT: '/logout',
    PGE_UPDATE: '/api/user/changePGE',
    UTILITY_USER: '/api/user/meterreadings/'
  },

  GraphTypes: keyMirror({
    USER_REQUIRE: null,
    MAIN: null,
    USER_KWH: null,
    USER_CARBON: null,
    DANGER_ZONE: null,
  }),

  Weekdays: {
    0: "Sun",
    1: "Mon",
    2: "Tues",
    3: "Wed",
    4: "Thurs",
    5: "Fri",
    6: "Sat",
  },

  Months : {
    0: "January",
    1: "Febuary",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  }
};