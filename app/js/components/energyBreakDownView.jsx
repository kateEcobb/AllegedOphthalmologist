var React = require('react');
var chart = require('./donutChart.js');


var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Dialog = mui.Dialog;
var RaisedButton = mui.RaisedButton;

var DataStore = require('./../stores/DataStore');


var ModalI = React.createClass({

  getInitialState: function(){
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
      showModal: false,
      standardActions: [
        {text: 'cancel', onClick: this.close},
        {text: 'submit', onTouchTap: this.close, ref: 'submit'}
      ]
    };
  },

  contextTypes: {
    muiTheme: React.PropTypes.string.isrequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function(){
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentDidMount: function(){
    this.setState({ data: DataStore.getData() });
    console.log(this.state.data);
  },

  componentDidUpdate: function(){
    chart.create('.modal-body', this.state.data.Watt[0].genmix.slice(1, 4), 'test1');
    chart.create('.modal-body', this.state.data.Watt[0].genmix, 'test2');
  },

  open: function(){
    this.setState({showModal: true});
    this.refs.dialog.show();
  },

  close: function(){
    this.setState({showModal: false});
    this.refs.dialog.dismiss();
  },

  render: function(){
    // button can be used with any conent that the <ModalInstance> tag is wrapped around
    // or the div can be used to wrap around other things like images
    // <div onClick={this.open}>{this.props.children}</div> 
    // console.log(this.refs.dialog)
    var modalbody = 'modal-body';
    return (
      <div>
        <RaisedButton label='modal' onClick={this.open} />
        <Dialog title='This is a material ui dialog box' 
          actions={this.state.standardActions} 
          actionFocus='submit' 
          modal={this.state.modal}
          ref='dialog'
          autoDetectWindowHeight={true} 
          autoScrollBodyContent={true}>

          {this.props.children}
          <div style={{'height': '500px'}} className={modalbody}></div>
          
        </Dialog>
      </div>
    )
  }
});


module.exports = ModalI;
      // <div>

      //   <Button onClick={this.open}>{this.props.children}</Button>

      //   <Modal show={this.state.showModal} onHide={this.close}>
      //     <Modal.Header>
      //       <Modal.Title>This is a modal</Modal.Title>
      //     </Modal.Header>
      //     <Modal.Body>  
      //       <div>this is a break down of where the electricity is coming from</div>
      //     </Modal.Body>
      //     <Modal.Footer>
      //       <Button onClick={this.close}>Close</Button>
      //     </Modal.Footer>
      //   </Modal>
      // </div>
