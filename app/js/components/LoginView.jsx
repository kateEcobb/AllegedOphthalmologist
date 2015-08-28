var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

// Actions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

// Stores
var UserStore = require('./../stores/UserStore');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

var LoginView = React.createClass({
  // Use a bit of two way data binding because forms are a pain otherwise.
  mixins: [React.addons.LinkedStateMixin, Router.Navigation],

  getInitialState: function() {
    return {
      username: null,
      password: null
    };
  },
  componentDidMount: function(){
    var context = this;
    this.token = Dispatcher.register(function (dispatch) {
      var action = dispatch.action;
      if (action.type === ActionTypes.USER_LOGIN_FAILURE) {
        // console.log('login failure');
        context.failedLogin();
      } 
      else if (action.type === ActionTypes.USER_LOGIN) {
        // console.log('login success');
        context.redirectHome();
      } 
    });
  },
  failedLogin: function(){
    $('.login-failure').css('visibility', 'visible');
    $('.spinner-container').css('visibility', 'hidden');
    $('.btn-submit').prop('disabled', false);
  },
  componentDidUnmount: function(){
    Dispatcher.unregister(this.token);
  },
  redirectHome: function(){
    this.transitionTo("/");
  },
  submitForm: function(){
    $('.spinner-container').css('visibility', 'visible');
    $('.btn-submit').prop('disabled', true);
    ViewActions.loginUser(this.state);
  },
  render: function() {
    return (
      <div className="container">
        <div className="login jumbotron center-block">
        <h2>Login</h2>
          <form id="login" role="form">
            <div className="form-group">
              <label htmlFor="username">Username: </label><br />
              <input className="form-control" id="username" type="text" valueLink={this.linkState('username')}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label><br />
              <input className="form-control" id="password" type="password" valueLink={this.linkState('password')} />
            </div>
          <button className="btn btn-submit" type="button" onClick={this.submitForm}>Login</button>
          </form>
          <div className="spinner-container">
            <div className="spinner-loader">
              Loading…
            </div>
          </div>
          <div className="login-failure">
            <p>
              Login Failure.
            </p>
            <p>
              Have you <Link to="/register">Registered</Link>?
            </p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LoginView;