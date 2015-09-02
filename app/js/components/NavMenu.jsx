var React = require('react');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

//Actions
var ActionTypes = require('./../constants/Constants').ActionTypes;
var ViewAction = require('../actions/ViewActions');


//mui theme
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

//dialog boxes
var register = require('./RegistrationView.jsx');
var profile = require('./ProfileView.jsx');
var login = require('./LoginView.jsx');


// Stores -- Load here so Stores can begin listening to Events
var UserStore = require('./../stores/UserStore');
var modalStore = require('./../stores/modalStore');

var NavMenu = React.createClass({
  getInitialState: function() {
    return {
      menuItems: [
        { route: register, text: 'Register' },
        { route: profile, text: 'Profile', reqLogin: true, disabled: true},
        { route: login, text: 'Login' }
      ]
    };
  },

  componentDidMount: function(){
    var context = this;
    this.token = Dispatcher.register(function (dispatch) {
      var action = dispatch.action;
      if (action.type === ActionTypes.TOGGLE_NAV_MENU) {
        // console.log('Nav menu button clicked');
        context.toggleNav();
      } 
      // Un-disable menu items requiring login when the user logs in
      else if(action.type === ActionTypes.USER_LOGIN){
        var menuItems = context.state.menuItems;
        for(var i = 0; i < menuItems.length; i++){
          if(menuItems[i].reqLogin){
            menuItems[i].disabled = false;
          }
        }
        context.setState({menuItems: menuItems});
      }
    });
  },

  toggleNav: function(){
    this.refs.leftNav.toggle();
  },

  handleMenuSelect: function(e, selectedIndex, menuItem){
    // console.log(e, selectedIndex, menuItem);
    ViewAction.loadModal(menuItem.route);
  },

  render: function(){
    return(
      <LeftNav ref="leftNav" docked={false} menuItems={this.state.menuItems} onChange={this.handleMenuSelect}/>
    );
  }
});

module.exports = NavMenu;