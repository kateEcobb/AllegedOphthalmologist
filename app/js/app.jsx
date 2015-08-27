var React = require('react');

// Routing
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

// Components
var MainView = require('./components/MainView.jsx');
var RegistrationView = require('./components/RegistrationView.jsx');

var App = React.createClass({

  mixins: [Router.Navigation, Router.State],

  render: function(){
    return (
      <RouteHandler />
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
  <Route name="register" path="/register" handler={RegistrationView} />
  <DefaultRoute name="default" handler={MainView} />
  </Route>
);

Router.run(routes, function(Root){
  React.render(<Root />, document.getElementById('AppView'));
});