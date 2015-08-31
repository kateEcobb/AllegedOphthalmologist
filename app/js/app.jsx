var React = require('react');

// Material UI
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// Routing
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

//mui theme
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

// Components
var MainView = require('./components/MainView.jsx');
var LoginView = require('./components/LoginView.jsx');
var ProfileView = require('./components/ProfileView.jsx');
var RegistrationView = require('./components/RegistrationView.jsx');
var engergyBreakDown = require('./components/energyBreakDownView.jsx');

// Stores -- Load here so Stores can begin listening to Events
var UserStore = require('./stores/UserStore');
var DataStore = require('./stores/DataStore');

var App = React.createClass({

  mixins: [Router.Navigation, Router.State],


  childContextTypes: {
    muiTheme: React.PropTypes.object
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
    var context = this;
    var menuItems = [
      { route: 'default', text: 'Home' },
      { route: 'register', text: 'Register' },
      { route: 'login', text: 'Login' }
    ];
    var context = this;
    return (
      <div className="app">
        <span className="nav-btn">
          <RaisedButton onClick={this.toggleNav}>Menu</RaisedButton>
        </span>
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems} onChange={this.handleMenuSelect}/>
      <RouteHandler />
      </div>
    );
  }
});

App.contextTypes = {
  router: React.PropTypes.func
};

var routes = (
  <Route name="app" path="/" handler={App}>
  <Route name="register" path="/register" handler={RegistrationView} />
  <Route name="login" path="/login" handler={LoginView} />
  <Route name="profile" path="/profile" handler={ProfileView} />
  <DefaultRoute name="default" handler={MainView} />
  </Route>
);

Router.run(routes, function(Root){
  React.render(<Root />, document.getElementById('AppView'));
});