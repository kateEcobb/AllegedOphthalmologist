var React = require('react/addons');
var Router = require('react-router');

// Actions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

// Stores
var UserStore = require('./../stores/UserStore');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

var RegistrationView = React.createClass({
  // Use a bit of two way data binding because forms are a pain otherwise.
  mixins: [React.addons.LinkedStateMixin, Router.Navigation],

  getInitialState: function() {
    return {
      username: null,
      password: null,
      pgeUsername: null,
      pgePassword: null,
      pgeFullName: null
    };
  },
  componentDidMount: function(){
    var context = this;
    this.token = Dispatcher.register(function (dispatch) {
      var action = dispatch.action;
      if (action.type === ActionTypes.USER_LOGIN_FAILURE) {
        // console.log('registration failure');
        context.failedRegistration();
      } 
      else if (action.type === ActionTypes.USER_LOGIN) {
        // console.log('registration success');
        context.redirectHome();
      } 
    });
  },
  failedRegistration: function(){
    console.log('registration failure');
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
    ViewActions.registerUser(this.state);
  },
  render: function() {
    return (
      <div className="container">
        <div className="login jumbotron center-block">
        <h2>Register</h2>
          <form id="register" role="form">
            <div className="form-group">
              <label htmlFor="pgeFullName">Full Name: </label><br />
              <input className="form-control" id="pgeFullName" type="text" valueLink={this.linkState('pgeFullName')} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username: </label><br />
              <input className="form-control" id="username" type="text" valueLink={this.linkState('username')}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label><br />
              <input className="form-control" id="password" type="password" valueLink={this.linkState('password')} />
            </div>
            <div className="form-group">
              <label htmlFor="pgeUsername">PG&E Username: </label><br />
              <input className="form-control" id="pgeUsername" type="text" valueLink={this.linkState('pgeUsername')} />
            </div>
            <div className="form-group">
              <label htmlFor="pgePassword">PG&E Password: </label><br />
              <input className="form-control" id="pgePassword" type="password" valueLink={this.linkState('pgePassword')} />
            </div>
          <button className="btn btn-submit" type="button" onClick={this.submitForm}>Register</button>
          </form>
          <div className="spinner-container">
            <div className="spinner-loader">
              Loading…
            </div>
          </div>
          <div className="login-failure">
            <p>
              Failed to Register.
            </p>
            <p>
              Is your PG&E Login Information Correct? 
            </p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RegistrationView;