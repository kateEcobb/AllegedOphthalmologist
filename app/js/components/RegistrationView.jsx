var React = require('react');
var addons = require('react-addons');

// Actions
var ViewActions = require('./../actions/ViewActions');

var RegistrationView = React.createClass({
  // Use a bit of two way data binding because forms are a pain otherwise.
  mixins: [addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      username: null,
      password: null,
      pgeUsername: null,
      pgePassword: null,
      pgeFullName: null
    };
  },

  submitForm: function(){
    //TODO: POST this.state to server
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
        </div>
      </div>
    );
  }
});

module.exports = RegistrationView;