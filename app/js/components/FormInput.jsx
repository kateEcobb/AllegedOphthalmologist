var React = require('react/addons');
var Formsy = require('formsy-react');

//MUI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;


var FormInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [React.addons.LinkedStateMixin, Formsy.Mixin],

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },

  render: function () {

    var className = this.props.className + ' ' + (this.showRequired() ? 'required' : this.showError() ? 'error' : null);
    var errorMessage = this.getErrorMessage();
    
    return (
      <div className='form-group'>
        <TextField hintText={this.props.title} type={this.props.type || 'text'} name={this.props.name} 
        errorText={errorMessage} onChange={this.changeValue} value={this.getValue()}/>
      </div>
    );
  }
});


module.exports = FormInput;