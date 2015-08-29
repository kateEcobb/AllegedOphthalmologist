var React = require('react/addons');
var Formsy = require('formsy-react');

var FormInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [React.addons.LinkedStateMixin, Formsy.Mixin],
  
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },

  render: function () {

    var className = this.props.className + ' ' + (this.showRequired() ? 'required' : this.showError() ? 'error' : null);
    var errorMessage = this.getErrorMessage();
    
    return (
      <div className='form-group'>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input className="form-control "type={this.props.type || 'text'} name={this.props.name} onChange={this.changeValue} value={this.getValue()}/>
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }
});

module.exports = FormInput;