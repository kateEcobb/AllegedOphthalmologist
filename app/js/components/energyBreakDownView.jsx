var React = require('react');
var chart = require('./chart.jsx');


var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;


var ModalI = React.createClass({

  getInitialState: function(){
    return {showModal: false};
  },

  propTypes: {
    data: [
      {id: '5fbmzmtc', x: 7, y: 41, z: 6},
      {id: 's4f8phwm', x: 11, y: 45, z: 9},
    ],
    domain: {x: [0, 30], y: [0, 100]}
  },

  // componentDidMount: function(){
  // },

  getChartState: function(){
    return {
      data: this.props.data,
      domain: this.props.domain
    }
  },

  componentDidUpdate: function(){
    // var el = this.getDOMNode();
    // console.log(el, '===============================================================');
    chart.create('.modal-body');
    // chart.create();
  },

  open: function(){
    this.setState({showModal: true});
  },

  close: function(){
    this.setState({showModal: false})
  },

  render: function(){
    return (
      <div>
        <Button onClick={this.open}>Launch</Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>This is a modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>  
            <div>this is a test of pop over modal</div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
});


module.exports = ModalI;
  
// <script>
//   console.log('===============================================================')
//   var el = this.getDOMNode();
//   chart.create(el)
// </script>