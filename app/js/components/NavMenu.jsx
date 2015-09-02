var React = require('react');

// Routing
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

//Actions
var ActionTypes = require('./../constants/Constants').ActionTypes;

//mui theme
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

// Stores -- Load here so Stores can begin listening to Events
var UserStore = require('./../stores/UserStore');

var NavMenu = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  mixins: [Router.Navigation],

  getInitialState: function() {
    return {
      menuItems: [
        { route: 'default', text: 'Home' },
        { route: 'register', text: 'Register' },
        { route: 'profile', text: 'Profile', reqLogin: true, disabled: true},
        { route: 'login', text: 'Login' }
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

  getChildContext: function(){
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  toggleNav: function(){
    this.refs.leftNav.toggle();
  },

  handleMenuSelect: function(e, selectedIndex, menuItem){
    // console.log(e, selectedIndex, menuItem);
    if(menuItem.route){
      this.transitionTo(menuItem.route);
    }
    this.toggleNav();
  },

  render: function(){
    return(
      <LeftNav ref="leftNav" docked={false} menuItems={this.state.menuItems} onChange={this.handleMenuSelect}/>
    );
  }
});

module.exports = NavMenu;