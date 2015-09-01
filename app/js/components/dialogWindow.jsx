var React = require('react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Dialog = mui.Dialog;
var RaisedButton = mui.RaisedButton;

var DataStore = require('./../stores/DataStore');


var dialog = React.createClass({

  getInitialState: function(){
    return {
      showModal: false,
      standardActions: [
      {text: 'cancel', onClick: this.close},
      // {text: 'tist', onClick: this.submit, ref: 'submit'}
      ]
    }
  },

  contextTypes: {
    muiTheme: React.PropTypes.string.isrequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function(){
    return{
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  open: function(){
    // Dialog.offsetHeight = '10px';
    // this.setState({showmModal: true});
    this.refs.dialogBox.show();
  },

  close: function(){
    this.refs.dialogBox.dismiss();
  },

  // sumbit: function(){
  //   //do submit stuff
  // },

  render: function(){
    return (
      <div className='hello'>
        <RaisedButton onClick={this.open}>{this.props.children[0]}</RaisedButton>
        <Dialog
          actions={this.state.standardActions}
          modal={this.state.modal}
          ref='dialogBox'
          autoDetectWindowHeight={true} 
          autoScrollBodyContent={true}>
          <div style={{'height': '500px'}}>
          {this.props.children}[1]
          </div>
        </Dialog>
      </div>
    )
  }
})

module.exports = dialog;
