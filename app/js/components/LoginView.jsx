var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

//MUI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;

//dialog
var Dialog = require('./dialogWindow.jsx');

// Form validation
var Formsy = require('formsy-react');
var FormInput = require('./FormInput.jsx');

// Actions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

// Stores
var UserStore = require('./../stores/UserStore');
var ModalStore = require('./../stores/modalStore');

// register view
var register = require('./RegistrationView.jsx');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');
var ModalDispatcher = require('./../dispatcher/ModalDispatcher');

var LoginView = React.createClass({
  // Use a bit of two way data binding because forms are a pain otherwise.
  mixins: [React.addons.LinkedStateMixin, Router.Navigation],

  getInitialState: function() {
    return {
      canSubmit: false
    };
  },
  componentDidMount: function(){
  UserStore.addChangeListener(this.successfulLogin);
    var context = this;
    var result = null;

    this.token = Dispatcher.register(function (dispatch) {
      var action = dispatch.action;
      if (action.type === ActionTypes.USER_LOGIN_FAILURE) {
        context.failedLogin();
      }
    });
  },

  successfulLogin: function(){ 
    ViewActions.loadModal();
    this.transitionTo('profile');
  },

  failedLogin: function(){
    $('.login-failure').css('visibility', 'visible');
    $('.spinner-container').css('visibility', 'hidden');
    this.enableButton();
  },
  componentWillUnmount: function(){
    Dispatcher.unregister(this.token);
    UserStore.removeChangeListener(this.successfulLogin)
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
    $('.spinner-container').css('visibility', 'visible');
    this.disableButton();
    // console.log('Logging in with: ', data);
    ViewActions.loginUser(data);
  },

  handleRegister: function(){
    // console.log('register');
    ViewActions.loadModal(register);
  }, 

  render: function() {
    return (
      <Dialog contentClassName={'loginDialog'} openImmediately={true}>
      <div className="LoginContainer">
        <h2 id='loginTitle'>Login</h2>
          
          <Formsy.Form onSubmit={this.submitForm} className="login" onValid={this.enableButton} onInvalid={this.disableButton}>
            <FormInput name="username" title="Email" type="text" 
              validations="isEmail" validationError="Please enter a valid email" required/>
            <FormInput name="password" title="Password" type="password" 
              validations="minLength:6" validationError="Password must be at least 6 characters in length"/>
          <FlatButton className="btn btn-submit" type="submit" disabled={!this.state.canSubmit}>Login</FlatButton>
          </Formsy.Form>
      </div>

      <div className="spinnerFailure">
          <div className="spinner-container">
            <div className="spinner-loader">Loading…</div>
          </div>
          <div className="login-failure">
            <p>Login Failure.</p>
            <p>Have you <a onClick={this.handleRegister} className='registerClick'>Registered</a>?</p>
          </div>
        </div>
      </Dialog>
    );
  }
});

module.exports = LoginView;
