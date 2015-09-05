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

// Dispatcher
var Dispatcher = require('./dispatcher/Dispatcher');

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
var modalStore = require('./stores/modalStore');

// Stores -- Load here so Stores can begin listening to Events
var UserStore = require('./stores/UserStore');
var DataStore = require('./stores/DataStore');

// Actions
var ViewActions = require('./actions/ViewActions');
var ActionTypes = require('./constants/Constants').ActionTypes;

var App = React.createClass({
  getInitialState: function(){
    return{
      showModal: modalStore.getModalState().isOpen,
      modal: null
    };

  },
  
  mixins: [Router.Navigation, Router.State],

  getChildContext: function(){
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  modalListener: function(){
    var modalSpecs = modalStore.getModalState();
    this.setState({showModal: modalSpecs.isOpen, modal: modalSpecs.modal});
  },

  componentWillMount: function(){ 
    //Set color palette
    var appPalette = { 
      primary1Color: '#58C1BE',
      primary2Color: '#227889',
      primary3Color: '#94D9BB',
      accent1Color: '#FFDE55',
      accent2Color: '#F6BB42',
      textColor: '#212121',
      canvasColor: '#FFFFFF',
      borderColor: '#B6B6B6'
    };
    ThemeManager.setPalette(appPalette);
  },

  componentDidMount: function() {
    modalStore.addChangeListener(this.modalListener);
  },

  componentWillUnmount: function (){
    modalStore.removeChangeListener(this.modalListener);
  },
  
  componentDidUnmount: function(){
    Dispatcher.unregister(this.token);
  },

  toggleNav: function(){
    ViewActions.toggleNavMenu();
  },

  render: function(){
    return (
      <div className="app-container">
      <div className="app-title">
        <h1>GridAware</h1>
        Compare your Energy Use to Current Grid Conditions
      </div>
        <span className="nav-btn">
          <RaisedButton onClick={this.toggleNav}>Menu</RaisedButton>
        </span>
        <NavMenu></NavMenu>
      <div className="content-container">
        <RouteHandler />
      </div>
      <div className="modal-container">
      { this.state.showModal ? 
        <div>
          <this.state.modal openImmediately={true} dialog={true} />
        </div> : null }
      </div>
      </div>
    );
  }
});


var routes = (
  <Route name="app" path="/" handler={App}>
  <Route name="profile" path="/profile" handler={ProfileView} />
  <DefaultRoute name="default" handler={MainView} />
  </Route>
);

Router.run(routes, function(Root){
  React.render(<Root />, document.getElementById('AppView'));
});