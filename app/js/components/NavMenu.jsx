var React = require('react');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

//Actions
var ActionTypes = require('./../constants/Constants').ActionTypes;
var ViewAction = require('../actions/ViewActions');

// Routing
var Router = require('react-router');
var Nav = Router.Navigation;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

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
var menuStore = require('./../stores/MenuItemStore');

var NavMenu = React.createClass({
  getInitialState: function() {
    return {
      menuItems: menuStore.getActiveItems()
    };
  },

  mixins: [Nav],

  changeMenuItems: function(){
    this.setState({menuItems: menuStore.getActiveItems()});
  },

  componentDidMount: function(){
    menuStore.addChangeListener(this.changeMenuItems);
    var context = this;
    this.token = Dispatcher.register(function (dispatch) {
      var action = dispatch.action;
      if (action.type === ActionTypes.TOGGLE_NAV_MENU) {
        // console.log('Nav menu button clicked');
        context.toggleNav();
      } 
      // Un-disable menu items requiring login when the user logs in
      else if(action.type === ActionTypes.USER_LOGIN){
        // console.log('getting this far')
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

  componentWillUnMount: function(){
    menuStore.removeChangeListener(this.changeMenuItems);
  },

  toggleNav: function(){
    this.refs.leftNav.toggle();
  },

  handleMenuSelect: function(e, selectedIndex, menuItem){
    console.log(e, selectedIndex, menuItem);
    if(menuItem.text === 'Profile'){
      console.log('transitioning')
      this.transitionTo('profile')
    }else if(menuItem.text === 'Home'){
      this.transitionTo('/')
    }else if(menuItem.text === 'Logout'){
      console.log('logging out');
      // var token = UserStore.getToken();
      ViewAction.logoutUser();
    }else{
      ViewAction.loadModal(menuItem.route);
    }
  },

  render: function(){
    return(
      <LeftNav ref="leftNav" docked={false} menuItems={this.state.menuItems} onChange={this.handleMenuSelect}/>
    );
  }
});

module.exports = NavMenu;