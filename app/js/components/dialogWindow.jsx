var React = require('react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Dialog = mui.Dialog;

var modalStore = require('./../stores/modalStore');

var ViewActions = require('../actions/ViewActions');

var dialog = React.createClass({

  getInitialState: function(){
    return {
      showModal: modalStore.getModalState().isOpen,
      standardActions: [
      {text: 'cancel', onClick: this.close},
      ]
    };
  },
  
  close: function(){
    this.refs.dialogBox.dismiss();
    ViewActions.loadModal();
  },
  
  render: function(){
    return (
      <div>
        <Dialog
          actions={this.state.standardActions}
          modal={true}
          ref='dialogBox'
          autoDetectWindowHeight={true} 
          autoScrollBodyContent={true}
          openImmediately={this.props.openImmediately}>
            <div style={{'height': '500px'}}>

              {this.props.children}
            
            </div>
        </Dialog>
      </div>
    );
  }
});

module.exports = dialog;