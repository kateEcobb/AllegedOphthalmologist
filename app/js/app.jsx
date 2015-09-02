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

// Components
var NavMenu = require('./components/NavMenu.jsx');
var MainView = require('./components/MainView.jsx');
var LoginView = require('./components/LoginView.jsx');
var ProfileView = require('./components/ProfileView.jsx');
var RegistrationView = require('./components/RegistrationView.jsx');
var engergyBreakDown = require('./components/energyBreakDownView.jsx');

// Stores -- Load here so Stores can begin listening to Events
var UserStore = require('./stores/UserStore');
var DataStore = require('./stores/DataStore');

// Actions
var ViewActions = require('./actions/ViewActions');

var App = React.createClass({

  mixins: [Router.Navigation, Router.State],

  getChildContext: function(){
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },
  
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  componentWillMount: function(){ 
    //Set color palette
    var appPalette = { 
      primary1Color: '#607D8B',
      primary2Color: '#455A64',
      primary3Color: '#CFD8DC',
      accent1Color: '#FFC107',
      accent2Color: '#F39C12',
      accent3Color: '#FFDE55',
      textColor: '#212121',
      canvasColor: '#FFFFFF',
      borderColor: '#B6B6B6'
    };
    ThemeManager.setPalette(appPalette);
  },

  toggleNav: function(){
    ViewActions.toggleNavMenu();
  },

  render: function(){
    return (
      <div className="app-container">
      <div className="app-title">
        <h1>EZ Energy Tracker</h1>
        Compare your Energy Use to Current Grid Conditions
      </div>
        <span className="nav-btn">
          <RaisedButton onClick={this.toggleNav}>Menu</RaisedButton>
        </span>
        <NavMenu></NavMenu>
      <div className="content-container">
        <RouteHandler />
      </div>
      </div>
    );
  }
});


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