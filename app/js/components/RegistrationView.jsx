var React = require('react/addons');
var Router = require('react-router');

//MUI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;


// Actions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

// Form validation
var Formsy = require('formsy-react');
var FormInput = require('./FormInput.jsx');

// Stores
var UserStore = require('./../stores/UserStore');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

var RegistrationView = React.createClass({
  // Use a bit of two way data binding because forms are a pain otherwise.
  mixins: [React.addons.LinkedStateMixin, Router.Navigation],

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState: function() {
    return {
      canSubmit: false
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
  enableButton: function () {
    this.setState({
      canSubmit: true
    });
  },
  disableButton: function () {
    this.setState({
      canSubmit: false
    });
  },
  submitForm: function(data){
    // console.log(data);
    $('.spinner-container').css('visibility', 'visible');
    $('.btn-submit').prop('disabled', true);
    ViewActions.registerUser(data);
  },
  render: function() {
    return (
      <div className="container">
        <div /*className="login jumbotron center-block"*/>
        <h2>Register</h2>
          <Formsy.Form onSubmit={this.submitForm} className="registration" onValid={this.enableButton} onInvalid={this.disableButton}>
            <FormInput name="pgeFullName" title="Full Name" type="text" 
              validations="isWords" validationError="Please enter your name"/>
            <FormInput name="username" title="Email" type="text" 
              validations="isEmail" validationError="Please enter a valid email."/>
            <FormInput name="password" title="Password" type="password" 
              validations={{minLength:6, maxLength: 20}} 
              validationError="Password must be between 6 and 20 characters"/>
            <FormInput name="pgeUsername" title="PG&E Username" type="text"/>
            <FormInput name="pgePassword" title="PG&E Password" type="password"/>
          <FlatButton className="btn btn-submit" type="submit" disabled={!this.state.canSubmit}>Register</FlatButton>
          </Formsy.Form>
          
          <div className="spinner-container">
            <div className="spinner-loader">
              Loading…
            </div>
          </div>
          <div className="login-failure">
            <p>Failed to Register.</p>
            <p>Is your PG&E Login Information Correct?</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RegistrationView;